import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#050814] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white">
              Interview App
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              Practice real and AI-powered interviews to gain confidence,
              improve answers, and perform better in real interviews.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/interview" className="hover:text-white transition">
                  Real Interview
                </Link>
              </li>
              <li>
                <Link to="/ai-interview" className="hover:text-white transition">
                  AI Interview
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition">
                  Features
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4">
              Contact
            </h4>
            <p className="text-sm">
              Have questions or feedback?
            </p>
            <p className="mt-2 text-sm text-blue-400">
              support@interviewapp.com
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-gray-800" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            © {new Date().getFullYear()} Interview App. All rights reserved.
          </p>

          <p className="mt-4 md:mt-0 text-gray-500">
            Built for interview preparation
          </p>
        </div>
      </div>
    </footer>
  );
}
