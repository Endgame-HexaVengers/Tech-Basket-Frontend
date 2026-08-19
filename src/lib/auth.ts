import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);



import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("tech_basket");

export const auth = betterAuth({
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
      maxAge: 20 * 24 * 60 * 60,
    },
  },

  plugins: [jwt()],
});