import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("TechBasket");
const vercelOrigins = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
]
  .filter(Boolean)
  .map((host) => (host!.startsWith("http") ? host! : `https://${host}`));
const configuredAuthUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  vercelOrigins[0];
const trustedOrigins = [
  configuredAuthUrl,
  process.env.NEXT_PUBLIC_APP_URL,
  ...vercelOrigins,
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: configuredAuthUrl,
  trustedOrigins,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      companyName: {
        type: "string",
        required: true,
      },

      branch: {
        type: "string",
        required: true,
      },

      role: {
        type: "string",
        required: true,
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
  },

});