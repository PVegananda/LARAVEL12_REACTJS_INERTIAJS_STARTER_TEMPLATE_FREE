import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Show() {
  const { post, related } = usePage<{
    post: {
      id: number;
      title: string;
      slug: string;
      content: string;
      thumbnail_url: string | null;
      created_at: string;
      category?: { id: number; name: string } | null;
      tags: { id: number; name: string }[];
    };
    related: {
      id: number;
      title: string;
      slug: string;
      thumbnail_url: string | null;
      created_at: string;
    }[];
  }>().props;

  // ====================================
  // 🔥 PROGRESS READING BAR
  // ====================================
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById("article-content");
      if (!article) return;

      const totalHeight =
        article.offsetHeight - window.innerHeight + 200;
      const scrollY = window.scrollY;

      setProgress(Math.min((scrollY / totalHeight) * 100, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head title={post.title} />

      {/* Progress Bar */}
      <div
        style={{ width: `${progress}%` }}
        className="h-1 bg-[#C9A227] fixed top-0 left-0 z-[999]"
      />

      <Navbar />

      <main className="min-h-screen bg-gray-50 text-black dark:bg-gray-900 dark:text-white">

        {/* =============================== */}
        {/* 🔥 HERO MODERN */}
        {/* =============================== */}
        {post.thumbnail_url && (
          <section className="relative w-full h-[420px] overflow-hidden">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              src={post.thumbnail_url}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

            {/* Text Over Hero */}
            <div className="absolute bottom-10 left-0 w-full px-6 lg:px-10">
              <div className="max-w-5xl mx-auto text-white">
                {post.category && (
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-md text-sm font-semibold rounded-full">
                    {post.category.name}
                  </span>
                )}

                <h1 className="text-4xl lg:text-6xl font-extrabold mt-4 leading-tight drop-shadow-lg">
                  {post.title}
                </h1>

                <p className="mt-3 text-gray-200 text-sm">
                  {new Date(post.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =============================== */}
        {/* 📝 CONTENT WRAPPER */}
        {/* =============================== */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-14">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {post.tags.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-800 border dark:border-gray-700"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          {/* CONTENT */}
          <article
            id="article-content"
            className="
              article-content mt-10 text-lg leading-relaxed
              dark:text-gray-200 
              prose prose-lg max-w-none
              prose-img:rounded-xl prose-img:shadow-xl
              prose-headings:text-[#0A1A2F] dark:prose-headings:text-white
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ====================================== */}
          {/* AUTHOR BOX MODERN */}
          {/* ====================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-20 p-8 border rounded-3xl bg-white shadow-xl 
                       dark:bg-gray-800 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold mb-4">Tentang Penulis</h3>

            <div className="flex items-center gap-6">
              <img
                src="https://i.pravatar.cc/150?img=12"
                className="w-24 h-24 rounded-full border shadow"
                alt="Dearetna"
              />

              <div>
                <h4 className="font-semibold text-xl">Dearetna</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Penulis artikel finansial yang menyajikan insight tentang ekonomi modern,
                  investasi cerdas, dan perencanaan masa depan.
                </p>

                {/* Social */}
                <div className="flex gap-4 mt-4 text-sm">
                  <a className="hover:text-[#C9A227] transition" href="#">Instagram</a>
                  <a className="hover:text-[#C9A227] transition" href="#">LinkedIn</a>
                  <a className="hover:text-[#C9A227] transition" href="#">YouTube</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back Link */}
          <div className="mt-10">
            <Link
              href="/posts"
              className="text-blue-600 hover:underline dark:text-blue-300"
            >
              ← Kembali ke semua artikel
            </Link>
          </div>
        </section>

        {/* =============================== */}
        {/* 🧭 RELATED ARTICLES (Card Premium) */}
        {/* =============================== */}
        {related && related.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-24">
            <h2 className="text-3xl font-bold mb-8">Artikel Terkait</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {related.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/posts/${item.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                               hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="h-44 overflow-hidden">
                      <img
                        src={
                          item.thumbnail_url ??
                          "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="p-5">
                      <h4 className="font-semibold text-lg group-hover:text-[#C9A227] transition">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
