import {
  postEnter,
  getEnter,
  postOut,
  getOut,
} from "../controllers/valuesControllers.js";

import { Router } from "express";
import { getToken } from "../middlewares/valluesMiddlewares.js";

const router = Router()
router.use(getToken)

router.post("/enter", postEnter);

router.get("/enter", getEnter);

router.post("/out", postOut);

router.get("/out", getOut);

export default router;