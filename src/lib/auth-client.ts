"use client";

import { createAuthClient } from "better-auth/react";
import {
    inferAdditionalFields,
    jwtClient,
} from "better-auth/client/plugins";

import type { auth } from "./auth";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,

    plugins: [
        jwtClient(),
        inferAdditionalFields<typeof auth>(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;