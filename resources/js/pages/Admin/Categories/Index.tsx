import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";

interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

interface Props extends Record<string, any> {
  categories: {
    data: Category[];
    links: any[];
  };
}


export default function Index() {
  const { categories } = usePage<Props>().props;

  const [deleteId, setDeleteId] = useState<number | null>(null);

  function confirmDelete() {
    if (!deleteId) return;
    router.delete(`/admin/categories/${deleteId}`, {
      onSuccess: () => setDeleteId(null),
    });
  }

  return (
    <AdminLayout title="Kelola Kategori">
      <Head title="Kelola Kategori" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0A1A2F]">
          Kelola Kategori
        </h1>

        <Link
          href="/admin/categories/create"
          className="bg-[#0A1A2F] text-white px-5 py-2 rounded-xl shadow hover:bg-black"
        >
          + Tambah Kategori
        </Link>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Total: {categories.data.length} kategori
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 text-xs uppercase tracking-wide bg-gray-50">
              <th className="p-4 font-semibold">Nama</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold">Dibuat</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categories.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  Tidak ada kategori.
                </td>
              </tr>
            ) : (
              categories.data.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-[#0A1A2F]">
                    {cat.name}
                  </td>

                  <td className="p-4 text-gray-600">{cat.slug}</td>

                  <td className="p-4 text-gray-600">
                    {new Date(cat.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right flex justify-end gap-3">

                    {/* EDIT BUTTON */}
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-6">
        {categories.links.map((link: any, i: number) => (
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

      {/* DELETE MODAL */}
      <DeleteModal
        show={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  );
}
