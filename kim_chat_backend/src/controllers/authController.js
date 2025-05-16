import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateOTP from '../utils/otpService.js';
import sendEmail from '../utils/mailService.js';

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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(201).json({ message: 'User created successfully', token, user });
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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.status(200).json({ message: 'Login sucess', token, user });
};

const forgotPassword = async (req, res) => {
  const userEmail = req.body.email;

  const userRecord = await User.findOne({ email: userEmail });

  if (!userRecord) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'No user found belong to this email.' });
  }

  try {
    const rawOTP = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(rawOTP, salt);
    const hashedOTPExpires = Date.now() + 10 * 60 * 1000;

    userRecord.otpHash = hashedOTP;
    userRecord.otpExpires = hashedOTPExpires;
    await userRecord.save();

    const emailMessage = `Password Reset Token: ${rawOTP}`;
    await sendEmail({
      email: userRecord.email,
      subject: 'Your password reset token. (Valid for 10 mins)',
      message: emailMessage,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email.',
    });
  } catch (error) {
    console.error('Error Details: ', error);
    userRecord.otpHash = undefined;
    userRecord.otpExpires = undefined;
    await userRecord.save();

    res.status(500).json({ status: 'fail', message: 'Internal server error.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token and new password required.' });
    }

    const resetTokens = await User.find({ otpExpires: { $gt: Date.now() } });

    let matchedToken = null;
    let userId = null;

    for (const item of resetTokens) {
      const isMatch = await bcrypt.compare(token, item.otpHash);
      if (isMatch) {
        matchedToken = item;
        userId = item.id;
      }
    }

    if (!matchedToken) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid or expired token.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      otpHash: null,
      otpExpires: null,
    });

    res.status(200).json({ status: 'success', message: 'Password updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error.' });
  }
};

export { signup, login, forgotPassword, resetPassword };
