import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/authServices";

const Auth = () => {
  const navigate = useNavigate();
  const { refetchUser } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "interviewee"
  });

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await loginUser({ email: form.email, password: form.password });
        await refetchUser();
        navigate("/");
      } else {
        await registerUser(form);
        navigate("/verify-otp", {
          state: { type: "register", email: form.email }
        });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Unable to process request. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl 
                   bg-white/5 backdrop-blur-xl 
                   border border-white/10 
                   shadow-[0_0_40px_rgba(79,70,229,0.25)]
                   p-6 text-white"
      >
        <h2 className="text-3xl font-semibold text-center">
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>
        <p className="text-gray-400 text-center mt-1 mb-5">
          {isLogin ? "Sign in to continue" : "Sign up to get started"}
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                className="auth-input"
                onChange={handleChange}
                required
              />

              <select
                name="role"
                onChange={handleChange}
                className="auth-input"
              >
                <option value="interviewee">Interviewee</option>
                <option value="interviewer">Interviewer</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 rounded-full 
                       bg-indigo-600 hover:bg-indigo-700 
                       transition font-medium"
          >
            {isLogin ? "Login" : "Register"}
          </motion.button>
        </form>

        {isLogin && (
          <p
            className="text-sm text-indigo-400 text-center mt-4 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>
        )}

        <p className="text-sm text-center mt-4 text-gray-400">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            className="text-indigo-400 cursor-pointer"
            onClick={() => {
              setError("");
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
