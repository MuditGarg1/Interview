import { motion } from "framer-motion";

const feedbacks = [
  {
    name: "Aman Sharma",
    role: "Final Year Student",
    feedback:
      "The AI interview felt surprisingly real. The feedback helped me understand exactly where I was going wrong.",
  },
  {
    name: "Priya Verma",
    role: "Frontend Developer",
    feedback:
      "Practicing before interviews boosted my confidence a lot. The role-based questions were very accurate.",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    feedback:
      "It felt like a personal interview coach. The AI feedback was clear and actionable.",
  },
  {
    name: "Sneha Patel",
    role: "Job Seeker",
    feedback:
      "The mock interviews reduced my anxiety before real interviews. Highly recommended.",
  },
];

export default function Feedbacks() {
  return (
    <section className="relative py-24 text-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-sm uppercase tracking-widest text-blue-400"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.p>

          <motion.h2
            className="mt-4 text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Loved by Learners & Professionals
          </motion.h2>

          <motion.p
            className="mt-4 max-w-2xl mx-auto text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            See how our AI-powered interview practice helps users
            gain confidence and perform better.
          </motion.p>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {feedbacks.map((item, index) => (
            <motion.div
              key={index}
              className="min-w-[320px] max-w-[360px] p-6 rounded-2xl 
                         bg-gradient-to-br from-[#0b1025] to-[#0e1538]
                         border border-blue-500/10"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              {/* Profile */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full 
                                bg-gradient-to-br from-blue-500 to-indigo-500 
                                flex items-center justify-center font-semibold">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-white text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-sm text-gray-300 leading-relaxed">
                “{item.feedback}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
