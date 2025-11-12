import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character.",
    }),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
