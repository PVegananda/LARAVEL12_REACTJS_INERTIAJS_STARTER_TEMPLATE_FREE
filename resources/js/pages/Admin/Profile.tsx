// resources/js/pages/Admin/Profile.tsx
// Profile page (admin) - TypeScript safe
// - menggunakan usePage<T>() dengan tipe yang memperluas Record<string, any>
// - event handler diberi tipe React.FormEvent<HTMLFormElement>
// - jelas komentar supaya gampang di-trace

import AdminLayout from "@/layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import type { PageProps } from "@inertiajs/core"; // optional helper import
import React from "react";

/**
 * Define User shape we expect (pastikan controller mengirim auth.user)
 * Tambahkan properti lain jika controller menyertakan.
 */
interface User {
  id: number;
  name: string;
  email: string;
  // add more fields if you expose them from backend (e.g. role, avatar)
}

/**
 * Page props: extend Record so Inertia's PageProps constraint terpenuhi.
 * We expect an `auth.user` object from backend (Inertia shared props).
 */
interface Props extends Record<string, any> {
  auth: {
    user: User;
  };
}

export default function Profile() {
  // usePage typed => usePage<Props>().props is not 'unknown'
  const { auth } = usePage<Props>().props;
  const user = auth?.user as User;

  // useForm dari Inertia untuk handle submit update
  // Kita hanya ijinkan edit `name` (email tidak bisa diubah di UI ini)
  const { data, setData, put, processing, errors } = useForm({
    name: user?.name ?? "",
    // email intentionally not sent as editable (disabled input shown for info)
  });

  // handle submit typed dengan React.FormEvent
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // PUT to admin profile route (controller akan handle validasi & update)
    put("/admin/profile", {
      onSuccess: () => {
        // optional: show flash atau notifikasi (backend dapat mengirim)
      },
    });
  }

  return (
    <AdminLayout title="Profil Saya">
      <Head title="Profil Saya" />

      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A1A2F]">Profil Pengguna</h1>

          {/* Back to posts (quick access) */}
          <a
            href="/admin/posts"
            className="px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            ← Kembali
          </a>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow border border-gray-100">
          {/* NAME */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-[#0A1A2F] text-gray-900"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* EMAIL (read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email (tidak dapat diubah)</label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed text-gray-700"
            />
          </div>

          {/* SUBMIT */}
          <div className="flex gap-3 justify-end">
            <a
              href="/admin/posts"
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Batal
            </a>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 rounded-md bg-[#0A1A2F] text-white hover:bg-black"
            >
              {processing ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
