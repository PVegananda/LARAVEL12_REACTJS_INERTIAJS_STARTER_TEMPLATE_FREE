import AdminLayout from "@/layouts/AdminLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

interface Category { id: number; name: string; }
interface Tag { id: number; name: string; }
interface Post {
  id: number;
  title: string;
  created_at: string;
  thumbnail_url?: string;
  status: string;
  category?: Category | null;
  tags?: Tag[];
}

interface DashboardProps extends Record<string, any> {
  totalPosts: number;
  published: number;
  drafts: number;
  latestPost: Post | null;
  recentPosts: Post[];
  categories: Category[];
  tags: Tag[];
  filters?: Record<string, any>;
}

export default function Dashboard() {
  const { totalPosts, published, drafts, latestPost, recentPosts, categories = [], tags = [], filters = {} } =
    usePage<DashboardProps>().props;

  // local filters (start from server filters)
  const [search, setSearch] = useState(filters.search ?? "");
  const [category, setCategory] = useState<string | null>(filters.category ?? "");
  const [tag, setTag] = useState<string | null>(filters.tag ?? "");
  const [status, setStatus] = useState<string | null>(filters.status ?? "");

  // finance tickers (animated text)
  const financeNews = [
    "📉 BTC sedikit koreksi — santai bro.",
    "💸 Harga kopi naik, tabungan nangis.",
    "📈 Pemula beli saham karena feeling.",
    "💰 Startup: 'pre-revenue' (belum cuan).",
    "🏦 Bank: 'Saldo Anda tidak cukup.'",
  ];
  const [ticker, setTicker] = useState(financeNews[0]);
  useEffect(() => {
    const id = setInterval(() => {
      setTicker(financeNews[Math.floor(Math.random()*financeNews.length)]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // apply filters by changing route (kept in query string)
  function applyFilters(params: Record<string, any> = {}) {
    const qs: Record<string, any> = {
      search,
      category,
      tag,
      status,
      ...params,
    };
    // remove empty values
    Object.keys(qs).forEach(k => { if (qs[k] === "" || qs[k] === null) delete qs[k]; });
    router.get(route('admin.posts.index'), qs, { preserveState: true, replace: true });
  }

  // simple chart data (derived from recentPosts)
  const chartData = useMemo(()=> {
    // group by date (last 7 days)
    const result: Record<string, number> = {};
    recentPosts.slice(0,7).forEach(p=>{
      const d = new Date(p.created_at).toLocaleDateString();
      result[d] = (result[d] ?? 0) + 1;
    });
    const labels = Object.keys(result);
    const max = Math.max(...Object.values(result), 1);
    return { result, labels, max };
  }, [recentPosts]);

  return (
    <AdminLayout>
      <Head title="Dashboard" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0A1A2F]">Dashboard</h1>

        <div className="text-sm text-gray-600">{ticker}</div>
      </div>

      {/* top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Total Posts</div>
          <div className="text-2xl font-bold text-[#0A1A2F] mt-2">{totalPosts}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{published}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Drafts</div>
          <div className="text-2xl font-bold text-yellow-600 mt-2">{drafts}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Latest</div>
          <div className="mt-2 text-sm">{latestPost?.title ?? "-"}</div>
        </div>
      </div>

      {/* filters + mini chart + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Filters</h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-200"
            />

            <select className="w-full p-2 rounded-lg bg-gray-100 border border-gray-200"
              value={category ?? ""}
              onChange={(e)=>setCategory(e.target.value ?? "")}
            >
              <option value="">All categories</option>
              {categories.map((c: Category)=> (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select className="w-full p-2 rounded-lg bg-gray-100 border border-gray-200"
              value={tag ?? ""}
              onChange={(e)=>setTag(e.target.value ?? "")}
            >
              <option value="">All tags</option>
              {tags.map((t: Tag)=> (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <select value={status ?? ""} onChange={(e)=>setStatus(e.target.value ?? "")}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-200"
            >
              <option value="">All status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <div className="flex gap-2">
              <button type="button" onClick={()=>applyFilters()} className="px-4 py-2 rounded-lg bg-[#0A1A2F] text-white">Apply</button>
              <button type="button" onClick={() => { setSearch(''); setCategory(''); setTag(''); setStatus(''); applyFilters({}); }} className="px-4 py-2 rounded-lg border">Reset</button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Activity (last 7)</h3>

          <div className="space-y-3">
            <div className="flex items-end gap-2 h-28">
              {chartData.labels.length === 0 ? (
                <div className="text-gray-400 text-sm">No recent posts</div>
              ) : (
                chartData.labels.map((label) => {
                  const value = chartData.result[label] ?? 0;
                  const height = Math.round((value / (chartData.max || 1)) * 100);
                  return (
                    <div key={label} className="flex-1">
                      <div className="bg-[#0A1A2F] rounded-md" style={{ height: `${height}%` }}></div>
                      <div className="text-xs text-gray-500 mt-2 text-center">{label}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Activity Feed</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {recentPosts.slice(0,6).map((p: Post) => (
              <li key={p.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                  <img src={p.thumbnail_url ?? 'https://via.placeholder.com/60'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#0A1A2F]">{p.title}</div>
                  <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
            {recentPosts.length === 0 && <li className="text-gray-500">No recent activity</li>}
          </ul>
        </div>
      </div>

      {/* compact recent posts table (styled like dashboard before) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#0A1A2F]">Recent Posts</h2>
          <div className="text-sm text-gray-500">Overview</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-600 uppercase">
                <th className="p-3">Thumb</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Tags</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentPosts.map((p: Post) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-3"><img src={p.thumbnail_url ?? 'https://via.placeholder.com/60'} className="w-12 h-8 object-cover rounded-md border" /></td>
                  <td className="p-3 font-medium text-[#0A1A2F]">{p.title}</td>
                  <td className="p-3">{p.category?.name ?? '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags?.map(tag => <span key={tag.id} className="px-2 py-1 rounded-full text-xs bg-gray-100 border border-gray-200">{tag.name}</span>)}
                    </div>
                  </td>
                  <td className="p-3">{p.status === 'published' ? <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full border border-green-100">Published</span> : <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100">Draft</span>}</td>
                  <td className="p-3 text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
