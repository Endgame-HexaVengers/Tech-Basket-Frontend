import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGODB_URI or MONGODB_URL environment variable is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.mongoClient ||
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const catalogDatabase = mongoClient.db("TechBasket");

