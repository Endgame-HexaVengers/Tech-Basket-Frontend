import { MongoClient } from "mongodb";

process.loadEnvFile(".env");

const client = new MongoClient(process.env.MONGODB_URL);

try {
  await client.connect();
  const database = client.db("TechBasket");
  const result = await database.collection("jwks").deleteMany({});
  console.log(`Removed ${result.deletedCount} stale Better Auth signing key(s).`);
} finally {
  await client.close();
}
