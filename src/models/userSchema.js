import joi from "joi";
export const userSchema = joi.object({
    name: joi.string().required().min(3).max(100),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirm: joi.ref("password"),
  });
  