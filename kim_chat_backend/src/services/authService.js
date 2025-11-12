import User from "../models/User.js";
import argon2 from "argon2";

const findUserByUsername = async (username) => {
  return await User.findOne({ username: username.toLowerCase() });
};

const findByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

const createUser = async ({ name, username, email, password }) => {
  // Hash password
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  const user = new User({
    name: name.toUpperCase(),
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return await user.save();
};

const validatePassword = async (inputPassword, storedPassword) => {
  const isValid = await argon2.verify(storedPassword, inputPassword);
  if (!isValid) {
    return false;
  }
  return true;
};

export { findUserByUsername, createUser, validatePassword, findByEmail };
