import {
  postSignUpParticipants,
  postSignInParticipants,
  getUsers,
} from "../controllers/users.Controllers.js";

import { Router } from "express";
const router = Router();

router.post("/sign-up", postSignUpParticipants);
router.post("/", postSignInParticipants);
router.get("/sign-up");
router.get("/users", getUsers);

export default router;
