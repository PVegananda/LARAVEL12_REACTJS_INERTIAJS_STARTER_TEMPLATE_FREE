import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      <Head title="Tentang Dearetna" />

      <Navbar />

      <main className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white min-h-screen">

        {/* =========================== */}
        {/* 🔥 HERO MODERN TANPA EMAS */}
        {/* =========================== */}
        <section className="relative py-28 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-extrabold tracking-tight"
            >
              Tentang <span className="text-[#0A1A2F] dark:text-white">Dearetna</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Dearetna hadir untuk memberikan edukasi finansial modern yang mudah dipahami
              dan relevan untuk semua kalangan.
            </motion.p>
          </div>
        </section>

        {/* =========================== */}
        {/* 🌟 ABOUT CONTENT */}
        {/* =========================== */}
        <section className="max-w-5xl mx-auto px-6 py-20 space-y-16">

          {/* INTRO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 leading-relaxed text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#0A1A2F] dark:text-white">
              Misi Kami
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Kami ingin membantu lebih banyak orang memahami keuangan dengan cara yang benar.
              Mulai dari investasi, budgeting, pendapatan pasif, hingga strategi masa depan—
              semuanya dibahas secara ringkas, jelas, dan mendalam.
            </p>
          </motion.div>

          {/* VALUES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10 text-[#0A1A2F] dark:text-white">
              Nilai Utama Kami
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "✨ Edukasi Berkualitas",
                  desc: "Setiap artikel dirancang agar mudah dipahami dan memberikan nilai nyata.",
                },
                {
                  title: "📈 Fokus Finansial Modern",
                  desc: "Kami membahas hal-hal relevan seperti investasi modern & ekonomi digital.",
                },
                {
                  title: "🤝 Untuk Semua Kalangan",
                  desc: "Pemula hingga expert dapat menemukan insight yang berguna.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center"
                >
                  <h3 className="text-xl font-semibold mb-3 text-[#0A1A2F] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* WHO IS DEARETNA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#0A1A2F] dark:text-white">
              Siapa Dearetna?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Seorang penulis yang ingin membawa literasi finansial ke level yang lebih mudah dipahami.
              Melalui tulisan yang ringkas, logis, dan informatif, Dearetna bertujuan menjadi jembatan
              antara ekonomi modern dan kehidupan nyata.
            </p>
          </motion.div>

          {/* SOCIAL MEDIA */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#0A1A2F] dark:text-white">
              Ikuti Kami
            </h2>

            <div className="flex justify-center gap-8 text-lg font-medium">
              <a href="#" className="hover:text-[#0A1A2F] transition">Instagram</a>
              <a href="#" className="hover:text-[#0A1A2F] transition">LinkedIn</a>
              <a href="#" className="hover:text-[#0A1A2F] transition">YouTube</a>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-[#0A1A2F] text-white text-center rounded-3xl p-12 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4">Mulai Jelajahi Artikel</h2>
            <p className="text-lg opacity-90 mb-6">
              Temukan insight finansial terbaik untuk masa depanmu.
            </p>
            <a
              href="/posts"
              className="px-8 py-3 bg-white text-[#0A1A2F] rounded-full font-semibold hover:opacity-80 transition"
            >
              Lihat Artikel →
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
