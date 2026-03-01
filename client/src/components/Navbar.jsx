import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../services/authServices";

const Navbar = () => {
  const {
    userData,
    setUserData,
    // isLoggedin,
    setIsLoggedIn,
    loading
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try{
      await logoutUser();
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/");
    }
    catch(err){
      console.error("Logout failed", err);

    }
  };

  if (loading) return null; // prevent flicker

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md border-b border-gray-800 text-white z-50 "
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <motion.div
          className="text-2xl font-extrabold cursor-pointer select-none"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        >
          Interview APP
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-gray-300 text-lg">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/interview" className="hover:text-white transition">Interview</Link>
          <Link to="/code" className="hover:text-white transition">Code</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
        </div>

        {/* Auth Section */}
        {!userData ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-semibold shadow-md"
            onClick={() => navigate("/login")}
          >
            Login
          </motion.button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <motion.button
              onClick={() => setMenuOpen((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700 px-4 py-2 rounded-full transition"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 font-bold">
                {userData.name?.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium">
                {userData.name}
              </span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className=" absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden"
                >
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 hover:bg-gray-800 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/settings"
                    className="block px-4 py-3 hover:bg-gray-800 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
