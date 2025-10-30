import { signupSchema, loginSchema } from "../validators/authValidator.js";
import logger from "../utils/logger.js";

export const validateSignup = async (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    logger.error("Validation error: %s", error);
    res.status(400).json({
      success: false,
      message: `${error.details[0].message}`,
    });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: `${error.details[0].message}`,
    });
  }
  next();
};
