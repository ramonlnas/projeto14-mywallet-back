import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import joi from "joi";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirm: joi.ref("password"),
});

const valueSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required().min(1).max(50),
  type: joi.string().valid("enter", "out"),
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("mywallet");
} catch (err) {
  console.log(err);
}

const userCollection = db.collection("users");
const userSession = db.collection("sessions");
const valueCollection = db.collection("value");

const time = dayjs().format("D/M");

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  try {
    const userExist = await userCollection.findOne({ email: user.email });
    console.log(userExist)

    if (userExist) {
      return res.status(409).send({ message: "Esse email já está cadastrado" });
    }

    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const passwordHash = bcrypt.hashSync(user.password, 12);
    const confirmPasswordHash = bcrypt.hashSync(user.confirm, 12);
    await userCollection.insertOne({
      name:user.name,
      email: user.email,
      password: passwordHash,
      confirm: confirmPasswordHash,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  const token = uuidV4();

  try {
    const userExist = await userCollection.findOne({ email });

    if (!userExist) {
      return res.send(401).status({ message: "Esse e-mail não existe!" });
    }

    const passwordOk = bcrypt.compareSync(password, userExist.password);

    if (!passwordOk) {
      return res.send(401).status({ message: "E-mail ou senha incorreto" });
    }

    // const sessionUser = await userSession.findOne({ userId: userExist._id });

    // if (sessionUser) {
    //   return res
    //     .status(401)
    //     .send({ message: "Você já está logado, saia para logar novamente" });
    // }

    await userSession.insertOne({
      token,
      userId: userExist._id,
    });

    res.send({ token, name: userExist.name });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/sign-up", async (req, res) => {
  try {
    const getParticipants = await userCollection.find().toArray();
    res.send(getParticipants);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/enter", async (req, res) => {
  const value = req.body;

  const { authorization } = req.headers; // Bearer Token

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { error } = valueSchema.validate(value, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    await valueCollection.insertOne({
      value: value.value,
      description: value.description,
      type: value.type,
      time: time,
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/enter", async (req, res) => {
  const { authorization } = req.headers; // Bearer Token

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const getValues = await valueCollection.find().toArray();
    res.send(getValues);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/out", async (req, res) => {
  const value = req.body;

  const { authorization } = req.headers; // Bearer Token

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { error } = valueSchema.validate(value, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    await valueCollection.insertOne({
      value: value.value,
      description: value.description,
      type: value.type,
      time: time,
    });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/out", async (req, res) => {
  const { authorization } = req.headers; // Bearer Token

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const getValues = await valueCollection.find().toArray();
    res.send(getValues);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//port
app.listen(5000, () => console.log("Server running in port 5000"));
