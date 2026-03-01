import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production"
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

   const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const tempToken = jwt.sign(
    { name, email, password, role, otp },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );
  // console.log(otp);

  await sendEmail(
    email,
    "Verify your account",
    `Your OTP is ${otp}`
  );
  
  

  res
    .cookie("tempToken", tempToken, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development"
    })
    .status(200)
    .json({ message: "OTP sent to email. Please verify." });
};


export const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const tempToken = req.cookies.tempToken;
    

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
   

    const user = await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      role: decoded.role,
      isVerified:true
    });
    
    
    const token = generateToken(user._id);

    res
      .clearCookie("tempToken")
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({ message: "User doesn't exist" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!user.isVerified) {
    return res.status(401).json({
      message: "Please verify your account using OTP"
    });
  }

  const token = generateToken(user._id);

  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail(
    email,
    "Reset Password OTP",
    `Your OTP is ${otp}`
  );

  res.json({
    message: "OTP sent to email"
  });
};

export const verifyForgotOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
  return res.status(404).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }


  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.json({
    message: "Password reset successful. Please login."
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};



