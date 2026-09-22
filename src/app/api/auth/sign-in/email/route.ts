import { auth } from "@/lib/auth";
import { consumeLoginVerification, VERIFICATION_COOKIE } from "@/lib/login-otp";
import { toNextJsHandler } from "better-auth/next-js";

const authHandler = toNextJsHandler(auth);

export async function POST(request: Request) {
	const cookie = request.headers.get("cookie") || "";
	const verification = cookie
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${VERIFICATION_COOKIE}=`))
		?.slice(VERIFICATION_COOKIE.length + 1);

	const body = (await request.clone().json()) as { email?: string };
	const [verifiedEmail, token] = decodeURIComponent(verification || "").split(":");

	if (!verifiedEmail || !token || verifiedEmail !== body.email?.trim().toLowerCase()) {
		return Response.json(
			{ message: "Please verify the code sent to your email before signing in." },
			{ status: 403 },
		);
	}

	const isVerified = await consumeLoginVerification(verifiedEmail, token);
	if (!isVerified) {
		return Response.json(
			{ message: "Your verification has expired. Please request a new code." },
			{ status: 403 },
		);
	}

	const response = await authHandler.POST(request);
	response.headers.append(
		"Set-Cookie",
		`${VERIFICATION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
	);
	return response;
}
