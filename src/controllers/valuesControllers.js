import { valueCollection } from "../database/db.js";
import dayjs from "dayjs";
import { valueSchema } from "../models/vallueSchema.js";
const time = dayjs().format("D/M");

export async function postEnter(req, res) {
  const value = req.body;
  const { id } = req.headers;

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
      user: id,
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getEnter(req, res) {
  const { id } = req.headers;
  console.log(id, "CHECANDO ID");

  try {
    const isUser = await valueCollection.find({ user: id }).toArray();
    console.log(isUser);
    if (!isUser) {
      return res.sendStatus(401);
    }
    const typeEnter = [];
    const typeOut = [];

    res.send({ isUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postOut(req, res) {
  const value = req.body;
  const { id } = req.headers;

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
      user: id,
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getOut(req, res) {
  const { id } = req.headers;
  console.log(id, "CHECANDO ID");

  try {
    const isUser = await valueCollection.find({ user: id }).toArray();
    console.log(isUser);
    if (!isUser) {
      return res.sendStatus(401);
    }

    res.send({ isUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
