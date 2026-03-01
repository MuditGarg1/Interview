import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function StartInterview() {
  return (
    <section className="relative  text-white">
      <div className="max-w-6xl pb-12 mx-auto px-6 text-center">

        {/* Section Label */}
        <motion.p
          className="text-sm uppercase tracking-widest text-blue-400"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Interview Modes
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="mt-4 text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Choose How You Want to Practice
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mt-4 max-w-2xl mx-auto text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Whether you want a quick mock interview or a fully AI-driven
          experience, pick the mode that fits your preparation style.
        </motion.p>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Real Interview */}
          <motion.div
            className="p-8 rounded-2xl bg-[#0b1025] border border-gray-800 text-left"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-semibold">
              Real Interview Practice
            </h3>

            <p className="mt-3 text-gray-400 text-sm">
              Practice hand-picked interview questions inspired by real
              interview rounds.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>• Role-based questions</li>
              <li>• Technical & behavioral focus</li>
              <li>• Self-paced practice</li>
            </ul>

            <Link
              to="/interview"
              className="inline-block mt-6 text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Start Real Interview →
            </Link>
          </motion.div>

          {/* AI Interview */}
          <motion.div
            className="p-8 rounded-2xl bg-[#0b1025] border border-blue-500/30 text-left"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-semibold">
              AI-Powered Interview
            </h3>

            <p className="mt-3 text-gray-400 text-sm">
              Experience a dynamic interview where AI adapts questions
              and evaluates your answers in real time.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>• Adaptive AI questions</li>
              <li>• Voice or text responses</li>
              <li>• Instant performance feedback</li>
            </ul>

            <Link
              to="/ai-interview"
              className="inline-block mt-6 text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Start AI Interview →
            </Link>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
