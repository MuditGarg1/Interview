import api from "../utils/axios";

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const verifyRegisterOtp = (otp) =>
  api.post("/auth/verify-register-otp", { otp });

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const forgot = (data) =>
  api.post("/auth/forgot-password", data);

export const verifyForgotOtpAndResetPassword = (data) =>
  api.post("/auth/reset-password", data);

export const logoutUser = () =>
  api.post("/auth/logout");

export const getMe = () =>
  api.get("/auth/me");
