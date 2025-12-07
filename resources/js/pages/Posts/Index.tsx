import { Head, Link, usePage, router } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  created_at: string;
}

interface Props extends Record<string, any> {
  posts: {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
  };
  filters: { search: string | null };
  popular_posts?: Post[];
}

export default function PostsIndex() {
  const { posts, filters, popular_posts } = usePage<Props>().props;

  const [search, setSearch] = useState(filters.search ?? "");

  // 🔍 Debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      router.get(
        "/posts",
        { search },
        { preserveState: true, replace: true },
      );
    }, 500);

    return () => clearTimeout(id);
  }, [search]);

  return (
    <>
      <Head title="Semua Artikel • Dearetna" />

      <Navbar />

      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen text-black dark:text-white">

        {/* ========================== */}
        {/* 🔥 Header Modern */}
        {/* ========================== */}
        <section className="pt-20 pb-12 px-6 lg:px-10 bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Semua Artikel
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {posts.total} artikel diterbitkan — temukan insight finansial terbaik untukmu.
            </p>

            {/* Search */}
            <div className="mt-6 w-full">
              <input
                type="text"
                placeholder="Cari artikel berdasarkan judul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-100
                  dark:bg-gray-700 text-black dark:text-white 
                  dark:border-gray-600 shadow-md focus:ring-2 focus:ring-[#0A1A2F] 
                  outline-none
                "
              />
            </div>
          </div>
        </section>

        {/* ========================== */}
        {/* ⭐ Popular Posts / Trending */}
        {/* ========================== */}
        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-16">
          <h2 className="text-2xl font-bold mb-6">Popular Minggu Ini</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {(popular_posts?.length ? popular_posts : posts.data.slice(0, 3)).map(
              (post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="
                      block bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                      overflow-hidden group hover:shadow-2xl transition
                    "
                  >
                    <div className="overflow-hidden">
                      <img
                        src={post.thumbnail_url ?? "https://via.placeholder.com/400x250"}
                        className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-semibold text-lg group-hover:text-[#0A1A2F] transition">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </section>

        {/* ========================== */}
        {/* 🆕 All Articles Grid Modern */}
        {/* ========================== */}
        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-20">
          <h2 className="text-2xl font-bold mb-8">Artikel Terbaru</h2>

          {posts.data.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 mt-6">
              Tidak ada artikel ditemukan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.data.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="
                      group bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                      hover:shadow-xl transition overflow-hidden
                    "
                  >
                    <div className="overflow-hidden">
                      <img
                        src={
                          post.thumbnail_url ??
                          "https://via.placeholder.com/350x220?text=No+Image"
                        }
                        className="
                          h-48 w-full object-cover group-hover:scale-105 
                          transition duration-500
                        "
                      />
                    </div>

                    <div className="p-5">
                      <h2 className="font-bold text-lg group-hover:text-[#0A1A2F] transition">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(post.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex gap-2 mt-14 justify-center">
            {posts.links.map((link, i) => (
              <Link
                key={i}
                href={link.url ?? ""}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium border transition
                  ${
                    link.active
                      ? "bg-[#0A1A2F] text-white border-[#0A1A2F] shadow"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
