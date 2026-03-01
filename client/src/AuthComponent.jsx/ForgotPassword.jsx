import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { forgot } from "../services/authServices";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgot({ email });
      navigate("/verify-otp", { state: { type: "forgot", email } });
    } catch (err) {
      setError(err?.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#050b18] to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Forgot Password
        </h2>

        <p className="mt-2 text-sm text-gray-400 text-center">
          Enter your registered email to receive a verification code
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
              required
              className="w-full rounded-lg bg-black border border-white/15 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-medium transition
              ${
                loading
                  ? "bg-white/10 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
