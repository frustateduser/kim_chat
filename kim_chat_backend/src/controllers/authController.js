import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {

  let { name, username, email, password } = req.body;


  name = name.toUpperCase();
  username = username.toLowerCase();
  email = email.toLowerCase();

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({ name, username, email, password: hashedPassword });
  await user.save();

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({ message: "User created successfully", token, user });

};

const login = async (req, res) => {

  let { username, password } = req.body;
  username = username.toLowerCase();

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: "Login sucess", token, user });
}

export { signup, login };