import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyForgotOtpAndResetPassword } from "../services/authServices";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!state?.email || !state?.otp) {
    return <p className="text-red-500 text-center mt-20">Invalid request</p>;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await verifyForgotOtpAndResetPassword({
        email: state.email,
        otp: state.otp,
        newPassword: password
      });
      navigate("/auth");
    } catch {
      setError("OTP invalid or expired");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050b18] to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Reset Password
        </h2>

        <p className="text-sm text-gray-400 text-center mt-2">
          Create a new password for your account
        </p>

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => {
              setError("");
              setPassword(e.target.value);
            }}
            required
            className="w-full rounded-lg bg-black border border-white/15 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />

          <button className="w-full rounded-lg py-2 font-medium bg-blue-600 hover:bg-blue-500 text-white transition">
            Reset Password
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
