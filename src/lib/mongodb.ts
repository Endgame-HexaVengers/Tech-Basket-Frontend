import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb+srv://TechBasket:DGSiflfSApQP7zPw@cluster0.3kbubif.mongodb.net/TechBasket?appName=Cluster0";

if (!uri) {
  throw new Error("MONGODB_URI or MONGODB_URL is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const mongoClient = globalForMongo.mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const catalogDatabase = mongoClient.db("TechBasket");

