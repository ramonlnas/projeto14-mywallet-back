import { sessionCollection, userCollection } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import userSchema from "../models/userSchema.js";


export async function postSignUpParticipants(req, res) {
  const user = req.body;

  try {
    const userExist = await userCollection.findOne({ email: user.email });

    if (userExist) {
      return res.status(409).send({ message: "Esse email já está cadastrado" });
    }
    console.log(user, "teste");

    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const passwordHash = bcrypt.hashSync(user.password, 12);
    const confirmPasswordHash = bcrypt.hashSync(user.confirm, 12);
    await userCollection.insertOne({
      name: user.name,
      email: user.email,
      password: passwordHash,
      confirm: confirmPasswordHash,
    });
    res.sendStatus(201)
  } catch (err) {
    console.log(err.data);
    res.sendStatus(500);
  }
}

export async function postSignInParticipants(req, res) {
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

    // const sessionUser = await sessionCollection.findOne({ userId: userExist._id });

    // if (sessionUser) {
    //   return res
    //     .status(401)
    //     .send({ message: "Você já está logado, saia para logar novamente" });
    // }

    await sessionCollection.insertOne({
      token,
      userId: userExist._id,
    });

    const user = await sessionCollection.findOne({ token });
    const id = user.userId;

    // console.log(user, "id")

    // res.locals.user = users;
    // console.log(res.locals.user, "TESTANDO")

    res.send({ token, name: userExist.name, id });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
export async function getUsers(req, res) {
  try {
    const users = await sessionCollection.find().toArray();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
}
