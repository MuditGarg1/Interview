import { motion } from "framer-motion";

const features = [
  {
    title: "AI Interviewer",
    description:
      "Experience a realistic interview with an AI that adapts questions based on your responses.",
  },
  {
    title: "Real-Time Feedback",
    description:
      "Get instant feedback on clarity, confidence, structure, and relevance of your answers.",
  },
  {
    title: "Role-Based Questions",
    description:
      "Practice questions tailored to your job role, experience level, and interview type.",
  },
  {
    title: "Performance Insights",
    description:
      "Understand your strengths and weaknesses with clear, actionable insights after each interview.",
  },
];

export default function Features() {
  return (
    <section className="relative py-2 text-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center">
          <motion.p
            className="text-sm uppercase tracking-widest text-blue-400"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Features
          </motion.p>

          <motion.h2
            className="mt-4 text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything You Need to Ace Interviews
          </motion.h2>

          <motion.p
            className="mt-4 max-w-2xl mx-auto text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our platform combines AI intelligence with real interview patterns
            to help you prepare smarter and faster.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl bg-[#0b1025] border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
