import { createHash, randomInt, randomUUID } from "node:crypto";
import { verifyPassword } from "better-auth/crypto";
import { ObjectId } from "mongodb";
import { catalogDatabase } from "@/lib/mongodb";

const OTP_EXPIRY_MS = 2 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const OTP_COLLECTION = "loginOtp";
const VERIFICATION_COOKIE = "tb_login_verification";

type LoginOtpDocument = {
  email: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  verifiedTokenHash?: string;
  verifiedAt?: Date;
};

const otpCollection = () =>
  catalogDatabase.collection<LoginOtpDocument>(OTP_COLLECTION);

const hashValue = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export const normalizeLoginEmail = (email: string) => email.trim().toLowerCase();

export const loginUserQuery = (identifier: string) => {
  const normalized = normalizeLoginEmail(identifier);
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escaped}$`, "i");

  return {
    $or: [
      { email: normalized },
      { email: regex },
      { username: normalized },
      { username: regex },
    ],
  };
};

export async function getLoginUser(identifier: string) {
  return catalogDatabase.collection("user").findOne(loginUserQuery(identifier));
}

export async function hasLoginUser(email: string) {
  return Boolean(await catalogDatabase.collection("user").findOne(loginUserQuery(email), { projection: { _id: 1 } }));
}

export async function verifyLoginCredentials(email: string, password: string) {
  const user = await catalogDatabase.collection("user").findOne(loginUserQuery(email));

  if (!user) return false;

  const rawId = (user._id ?? (user as Record<string, unknown>).id) as unknown;
  if (!rawId) return false;

  const idString = String(rawId);
  const idVariants: unknown[] = [rawId, idString];
  if (ObjectId.isValid(idString)) {
    try {
      idVariants.push(new ObjectId(idString));
    } catch {
      // ignore
    }
  }

  const account = await catalogDatabase.collection("account").findOne({
    $or: [
      { providerId: "credential", userId: { $in: idVariants } },
      { providerId: "credential", accountId: { $in: idVariants } },
      { userId: { $in: idVariants } },
      { accountId: { $in: idVariants } },
    ],
  });

  const hashedPassword =
    typeof account?.password === "string"
      ? account.password
      : typeof user?.password === "string"
        ? (user.password as string)
        : null;

  if (!hashedPassword) return false;

  return verifyPassword({ hash: hashedPassword, password });
}

export async function sendLoginOtp(email: string) {
  const normalizedEmail = normalizeLoginEmail(email);
  const otp = randomInt(100000, 1000000).toString();

  await otpCollection().deleteMany({ email: normalizedEmail });
  await otpCollection().insertOne({
    email: normalizedEmail,
    codeHash: hashValue(otp),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    attempts: 0,
  });

  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    console.log(`\n🔑 [TechBasket OTP] Verification Code for ${normalizedEmail}: \x1b[32m\x1b[1m${otp}\x1b[0m (valid for 2 mins)\n`);
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
  const smtpUser = process.env.BREVO_SMTP_USER?.trim();
  const smtpPassword = (process.env.BREVO_SMTP_PASSWORD || process.env.BREVO_SMTP_KEY)?.trim();
  const smtpFrom = process.env.BREVO_FROM_EMAIL?.trim() || smtpUser;

  const hasGmail = Boolean(gmailUser && gmailPass);
  const hasResend = Boolean(
    resendApiKey &&
      resendApiKey !== "YOUR_RESEND_API_KEY" &&
      resendFrom,
  );
  const hasBrevo = Boolean(
    smtpUser &&
      smtpPassword &&
      smtpPassword !== "YOUR_BREVO_SMTP_KEY" &&
      smtpFrom,
  );

  if (!hasGmail && !hasResend && !hasBrevo) {
    if (isDev) {
      console.log(
        `\n🔐 [DEV] OTP for ${normalizedEmail}: \x1b[33m${otp}\x1b[0m  (expires in 2 min)\n`,
      );
      return;
    }
    await otpCollection().deleteMany({ email: normalizedEmail });
    throw new Error("Email delivery is not configured.");
  }

  const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:#4f46e5;color:white;font-weight:bold;font-size:20px;padding:10px 24px;border-radius:10px;letter-spacing:1px;">TechBasket</div>
      </div>
      <h2 style="color:#111827;font-size:20px;margin-bottom:8px;text-align:center;">Login Verification Code</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:24px;text-align:center;">Use the code below to complete your sign-in.<br/>It expires in <strong>2 minutes</strong>.</p>
      <div style="background:white;border:2px solid #4f46e5;border-radius:10px;padding:28px;text-align:center;margin-bottom:24px;">
        <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#4f46e5;font-family:monospace;">${otp}</span>
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;">Do not share this code. TechBasket will never ask for your code.</p>
    </div>
  `;

  // ১. Gmail SMTP দিয়ে পাঠানোর চেষ্টা (primary - Port 465 SSL)
  if (hasGmail) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 15000,
      });
      const info = await transporter.sendMail({
        from: `"TechBasket" <${gmailUser}>`,
        to: normalizedEmail,
        replyTo: gmailUser,
        subject: `TechBasket Verification Code: ${otp}`,
        text: `Your TechBasket verification code is: ${otp}. This code will expire in 2 minutes. Do not share this code with anyone.`,
        html: emailHtml,
      });
      console.log(`✅ OTP sent via Gmail to ${normalizedEmail} | Message ID: ${info.messageId}`);
      return;
    } catch (err) {
      console.error("Gmail OTP send failed", err);
      // fallback-এ যাবো
    }
  }

  // ২. Resend API দিয়ে পাঠানোর চেষ্টা (fallback)
  if (hasResend) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `TechBasket <${resendFrom}>`,
          to: [normalizedEmail],
          subject: "Your TechBasket Login Verification Code",
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          `Resend API returned ${response.status}: ${details || "No error details"}`,
        );
      }

      console.log(`✅ OTP sent via Resend to ${normalizedEmail}`);
      return;
    } catch (err) {
      console.error("Resend OTP send failed", err);
      // Brevo দিয়ে fallback করার চেষ্টা করবো
    }
  }

  // ৩. Brevo SMTP দিয়ে পাঠানোর চেষ্টা (last fallback)
  if (hasBrevo) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });

      await transporter.sendMail({
        from: `"TechBasket" <${smtpFrom}>`,
        to: normalizedEmail,
        subject: "Your TechBasket Login Verification Code",
        html: emailHtml,
      });
      console.log(`✅ OTP sent via Brevo to ${normalizedEmail}`);
      return;
    } catch (err) {
      console.error(
        "Brevo OTP send failed. Install dependencies with `npm install` if nodemailer is missing.",
        err,
      );
    }
  }

  // সব provider fail হলে
  if (isDev) {
    console.log(
      `\n🔐 [DEV] Email failed. OTP for ${normalizedEmail}: \x1b[33m${otp}\x1b[0m  (expires in 2 min)\n`,
    );
    return;
  }
  await otpCollection().deleteMany({ email: normalizedEmail });
  throw new Error("Could not send the verification code.");
}



export async function verifyLoginOtp(email: string, otp: string) {
  const normalizedEmail = normalizeLoginEmail(email);
  const record = await otpCollection().findOne({ email: normalizedEmail });

  if (!record || record.expiresAt.getTime() <= Date.now() || record.attempts >= MAX_ATTEMPTS) {
    return null;
  }

  if (hashValue(otp.trim()) !== record.codeHash) {
    await otpCollection().updateOne(
      { email: normalizedEmail },
      { $inc: { attempts: 1 } },
    );
    return null;
  }

  const verificationToken = randomUUID();
  await otpCollection().updateOne(
    { email: normalizedEmail },
    {
      $set: {
        verifiedTokenHash: hashValue(verificationToken),
        verifiedAt: new Date(),
      },
      $unset: { codeHash: "", expiresAt: "" },
    },
  );

  return verificationToken;
}

export async function consumeLoginVerification(email: string, token: string) {
  const normalizedEmail = normalizeLoginEmail(email);
  const record = await otpCollection().findOne({ email: normalizedEmail });
  if (!record?.verifiedTokenHash || !record.verifiedAt) return false;

  const isFresh = Date.now() - record.verifiedAt.getTime() <= OTP_EXPIRY_MS;
  const isValid = hashValue(token) === record.verifiedTokenHash;
  if (!isFresh || !isValid) return false;

  await otpCollection().deleteOne({ email: normalizedEmail });
  return true;
}

export { VERIFICATION_COOKIE };