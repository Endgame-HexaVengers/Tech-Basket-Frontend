import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { catalogDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

const userCollection = () => catalogDatabase.collection("user");

const formatUser = (user: Record<string, any>) => ({
  id: String(user.id),
  fullName: user.name || "Unnamed user",
  username: user.username || user.email?.split("@")[0] || "",
  email: user.email || "",
  phone: user.phone || "",
  systemRole: user.role || "User",
  assignedBranch: user.branch || "Unassigned",
  status: user.banned ? "Draft" : "Active",
  createdAt: user.createdAt?.toISOString?.() || "",
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await userCollection()
      .find(
        {},
        {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            username: 1,
            email: 1,
            phone: 1,
            role: 1,
            branch: 1,
            banned: 1,
            createdAt: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      users: users.map((user) => formatUser(user)),
    });
  } catch (error) {
    console.error("Users GET failed", error);
    return NextResponse.json({ error: "Could not load users." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      fullName?: string;
      username?: string;
      email?: string;
      phone?: string;
      password?: string;
      role?: string;
      branch?: string;
      status?: "Active" | "Draft";
    };

    const fullName = body.fullName?.trim() || "";
    const username = body.username?.trim() || "";
    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";
    const role = body.role?.trim() || "User";
    const branch = body.branch?.trim() || "Unassigned";

    if (!fullName || !username || !email || password.length < 8) {
      return NextResponse.json(
        { error: "Name, username, email and a password of at least 8 characters are required." },
        { status: 400 },
      );
    }

    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: fullName,
        email,
        password,
        companyName: "TechBasket Ltd.",
        branch,
        role,
      },
    });

    const createdUser = signUpResult.user;
    if (!createdUser) {
      return NextResponse.json({ error: "Could not create user." }, { status: 500 });
    }

    await userCollection().updateOne(
      { id: createdUser.id },
      {
        $set: {
          username,
          phone: body.phone?.trim() || "",
          role,
          branch,
          banned: body.status === "Draft",
        },
      },
    );

    const savedUser = await userCollection().findOne({ id: createdUser.id });
    return NextResponse.json({ user: formatUser(savedUser || { ...createdUser, username, phone: body.phone, role, branch }) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create user.";
    if (/already exists|duplicate|unique/i.test(message)) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    console.error("Users POST failed", error);
    return NextResponse.json({ error: "Could not create user." }, { status: 500 });
  }
}
