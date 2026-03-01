import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Heading() {
  return (
    <section 
    className=" relative min-h-[70vh] flex items-center justify-center overflow-hidden text-white"
    >

      {/* Soft Background Accents */}
      {/* <motion.div
        className="absolute top-24 left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-24 right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      /> */}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Prepare Smarter for Your
          <span className="block text-blue-500 ">
            Next Interview
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Practice real interview scenarios, get AI-driven feedback,
          and improve your confidence before the real one.
        </motion.p>

        {/* CTA */}
         <motion.div
          className="mt-12 flex justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/interview"
              className="relative inline-block px-9 py-4 rounded-full bg-blue-600 font-medium shadow-md"
            >
              Start Interview
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/features"
              className="inline-block px-9 py-4 rounded-full border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition"
            >
              View Features
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] bg-[size:48px_48px] opacity-15" />
    </section>
  );
}
