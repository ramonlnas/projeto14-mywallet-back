import joi from "joi";
export const valueSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required().min(1).max(50),
    type: joi.string().valid("enter", "out"),
  });
  