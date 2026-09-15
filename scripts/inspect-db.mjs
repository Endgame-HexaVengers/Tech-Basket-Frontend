import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
console.log("Using URI:", uri ? "FOUND" : "NOT FOUND");

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    
    // Check databases
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));

    // Check TechBasket database
    const dbTech = client.db("TechBasket");
    const techCols = await dbTech.listCollections().toArray();
    console.log("TechBasket collections:");
    for (const c of techCols) {
      const count = await dbTech.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count} documents`);
    }

    // Check tech_basket database
    const dbTech2 = client.db("tech_basket");
    const techCols2 = await dbTech2.listCollections().toArray();
    console.log("tech_basket collections:");
    for (const c of techCols2) {
      const count = await dbTech2.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count} documents`);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
