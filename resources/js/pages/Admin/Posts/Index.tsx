import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { useState, useEffect } from "react";
import DeleteModal from "@/components/DeleteModal";

interface Category { id:number; name:string; }
interface Tag { id:number; name:string; }
interface Post {
  id:number; title:string; slug:string; created_at:string;
  thumbnail_url?:string; status:string; category?:Category|null; tags?:Tag[];
}

interface Props extends Record<string, any> {
  posts: { data: Post[]; links: any[] };
  categories: Category[];
  tags: Tag[];
  filters: Record<string, any>;
}

export default function Index() {
  const { posts, categories = [], tags = [], filters = {} } =
    usePage<Props>().props;

  // state
  const [search, setSearch] = useState(filters.search ?? "");
  const [category, setCategory] = useState(filters.category ?? "");
  const [tag, setTag] = useState(filters.tag ?? "");
  const [status, setStatus] = useState(filters.status ?? "");
  const [perPage, setPerPage] = useState(Number(filters.per_page ?? 10));
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      applyFilters();
    }, 600);
    return () => clearTimeout(id);
  }, [search, category, tag, status, perPage]);

  function applyFilters(extra: any = {}) {
    const qs: any = {
      search,
      category,
      tag,
      status,
      per_page: perPage,
      ...extra,
    };

    Object.keys(qs).forEach((k) => {
      if (qs[k] === "" || qs[k] === null) delete qs[k];
    });

    router.get(route("admin.posts.index"), qs, {
      preserveState: true,
      replace: true,
    });
  }

  function toggleSelect(id: number) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function toggleSelectAll() {
    const all = posts.data.map((p) => p.id);
    setSelected(selected.length === all.length ? [] : all);
  }

  // single delete confirm
  function confirmDeleteSingle() {
    if (!deleteId) return;

    router.delete(`/admin/posts/${deleteId}`, {
      onSuccess: () => setDeleteId(null),
    });
  }

  // bulk delete
  function confirmBulkDelete() {
    if (selected.length === 0) return;

    router.post(
      "/admin/posts/bulk-delete",
      { ids: selected },
      {
        onSuccess: () => setSelected([]),
      }
    );
    setBulkConfirmOpen(false);
  }

  return (
    <AdminLayout title="Kelola Post">
      <Head title="Kelola Post" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0A1A2F]">Kelola Post</h1>
        <Link
          href="/admin/posts/create"
          className="bg-[#0A1A2F] text-white px-5 py-2 rounded-xl shadow"
        >
          + Tambah Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="text"
            placeholder="Search title or content..."
            className="flex-1 p-2 rounded-lg bg-gray-100 border border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-lg bg-gray-100 border border-gray-200"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="p-2 rounded-lg bg-gray-100 border border-gray-200"
          >
            <option value="">All tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded-lg bg-gray-100 border border-gray-200"
          >
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="p-2 rounded-lg bg-gray-100 border border-gray-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          {/* Bulk actions */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  selected.length > 0 &&
                  selected.length === posts.data.length
                }
                onChange={toggleSelectAll}
              />
              <span className="text-sm text-gray-600">Select</span>
            </label>

            <button
              disabled={selected.length === 0}
              onClick={() => setBulkConfirmOpen(true)}
              className={`px-3 py-1 rounded-lg text-sm ${
                selected.length === 0
                  ? "bg-gray-100 text-gray-400"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              Bulk Delete ({selected.length})
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {posts.data.length} items
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 text-xs uppercase tracking-wide bg-gray-50">
              <th className="p-4 font-semibold"></th>
              <th className="p-4 font-semibold">Thumbnail</th>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Tags</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {posts.data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-8 text-gray-500"
                >
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>

                  <td className="p-4">
                    <img
                      src={p.thumbnail_url ?? "https://via.placeholder.com/80"}
                      className="w-16 h-12 object-cover rounded-md border"
                    />
                  </td>

                  <td className="p-4 font-medium text-[#0A1A2F]">
                    {p.title}
                  </td>

                  <td className="p-4">
                    {p.category?.name ?? "-"}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.map((t) => (
                        <span
                          key={t.id}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    {p.status === "published" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                        Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                        Draft
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-600">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right flex justify-end gap-3">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      Edit
                    </Link>

                    {/* OPEN DELETE MODAL */}
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        {posts.links.map((link: any, i: number) => (
          <Link
            key={i}
            href={link.url ?? ""}
            className={`px-4 py-2 rounded-lg text-sm border ${
              link.active
                ? "bg-[#0A1A2F] text-white border-[#0A1A2F]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>

      {/* SINGLE DELETE MODAL */}
      <DeleteModal
        show={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteSingle}
      />

      {/* BULK DELETE MODAL */}
      {bulkConfirmOpen && (
        <DeleteModal
          show={true}
          onClose={() => setBulkConfirmOpen(false)}
          onConfirm={confirmBulkDelete}
          message={`Delete ${selected.length} posts? This cannot be undone.`}
        />
      )}
    </AdminLayout>
  );
}
