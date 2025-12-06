import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";

interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

interface Props extends Record<string, any> {
  tags: {
    data: Tag[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function Index() {
  const { tags } = usePage<Props>().props;
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function confirmDelete() {
    if (deleteId === null) return;
    router.delete(`/admin/tags/${deleteId}`, {
      onSuccess: () => setDeleteId(null),
    });
  }

  return (
    <AdminLayout title="Tag">
      <Head title="Tag" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0A1A2F]">Kelola Tag</h1>

        <Link
          href="/admin/tags/create"
          className="bg-[#0A1A2F] text-white px-5 py-2 rounded-xl shadow hover:bg-black"
        >
          + Tambah Tag
        </Link>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* TABLE */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 text-xs uppercase tracking-wide bg-gray-50">
              <th className="p-4 font-semibold">Nama</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold">Tanggal</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tags.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  Tidak ada tag.
                </td>
              </tr>
            ) : (
              tags.data.map((tag: Tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 transition">

                  <td className="p-4 font-medium text-[#0A1A2F]">
                    {tag.name}
                  </td>

                  <td className="p-4 text-gray-600">{tag.slug}</td>

                  <td className="p-4 text-gray-600">
                    {new Date(tag.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right flex justify-end gap-3">
                    <Link
                      href={`/admin/tags/${tag.id}/edit`}
                      className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteId(tag.id)}
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
        {tags.links.map((link: any, i: number) => (
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
