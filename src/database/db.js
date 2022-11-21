import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();


const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("mywallet");
  console.log("conectado")
} catch (err) {
  console.log(err);
}

export const userCollection = db.collection("users");
export const sessionCollection = db.collection("sessions");
export const valueCollection = db.collection("value");
