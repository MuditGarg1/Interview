import express from "express";
import { protect } from "../middleware/userAUTH.js";
import {
  register,
  verifyRegisterOtp,
  login,
  forgotPassword,
  verifyForgotOtpAndResetPassword,
  logout
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyForgotOtpAndResetPassword);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified
    }
  });
});

export default router;
