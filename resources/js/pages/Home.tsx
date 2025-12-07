import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";


interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  created_at: string;
}

interface Props {
  posts: Post[];
  [key: string]: any; // <— tambahan ini wajib
}

export default function Home() {
  const { posts } = usePage<Props>().props;

  const featured = posts[0] ?? null;
  const trending = posts.slice(1, 5);
  const latest = posts.slice(0, 6);
  const popular = posts.slice(0, 6);
  const editorsPick = posts.slice(0, 3);

  return (
    <>
      <Head title="Dearetna • Financial Insights" />
      <Navbar />

      <main className="bg-white dark:bg-[#0f0f0f] text-black dark:text-white">

        {/* ================= HERO MODERN ================= */}
        {featured && (
          <section className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14">

              {/* LEFT IMAGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/posts/${featured.slug}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <img
                      src={featured.thumbnail_url ?? "https://via.placeholder.com/900x500?text=No+Image"}
                      className="w-full h-[450px] object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>
                </Link>
              </motion.div>

              {/* RIGHT TEXT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center"
              >
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                  <Link href={`/posts/${featured.slug}`} className="hover:text-blue-400 transition">
                    {featured.title}
                  </Link>
                </h1>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                  {new Date(featured.created_at).toLocaleDateString()}
                </p>

                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                  Deep insights, financial analysis, and modern economics curated to help you stay ahead.
                </p>

                <Link
                  href={`/posts/${featured.slug}`}
                  className="mt-6 inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:opacity-80 transition"
                >
                  Read Featured Insight →
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* ================= TRENDING ================= */}
        <section className="py-20 bg-gray-50 dark:bg-[#121212]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-8">Trending Now</h2>

              <div className="space-y-6">
                {trending.map((t) => (
                  <Link key={t.id} href={`/posts/${t.slug}`} className="group flex gap-6 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <img
                      src={t.thumbnail_url ?? "https://via.placeholder.com/300"}
                      className="w-32 h-24 object-cover rounded-lg shadow"
                    />
                    <div>
                      <h4 className="font-semibold text-lg group-hover:text-blue-400 transition">{t.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* category highlight */}
            <div className="w-full lg:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-5">
              <h3 className="font-bold text-xl">Categories</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="hover:text-blue-400 transition">• Finance</li>
                <li className="hover:text-blue-400 transition">• Investment</li>
                <li className="hover:text-blue-400 transition">• Technology</li>
                <li className="hover:text-blue-400 transition">• Economy</li>
                <li className="hover:text-blue-400 transition">• Business Strategy</li>
              </ul>
            </div>

          </div>
        </section>

        {/* ================= LATEST ================= */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12">Latest Insights</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {latest.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link href={`/posts/${post.slug}`}>
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                      <div className="relative">
                        <img
                          src={post.thumbnail_url ?? "https://via.placeholder.com/400"}
                          className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-lg group-hover:text-blue-400 transition">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= POPULAR ================= */}
        <section className="py-20 bg-gray-50 dark:bg-[#121212]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-10">Popular Insights</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {popular.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} className="group">
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                    <img
                      src={post.thumbnail_url ?? "https://via.placeholder.com/500"}
                      className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                    />

                    <div className="p-5">
                      <h4 className="font-bold text-lg group-hover:text-blue-400 transition">{post.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= EDITOR PICKS ================= */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-10">Editor’s Picks</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {editorsPick.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} className="group">
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                    <img
                      src={post.thumbnail_url ?? "https://via.placeholder.com/600"}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="p-5 space-y-2">
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
