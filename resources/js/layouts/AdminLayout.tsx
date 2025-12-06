import { ReactNode, useEffect, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Toast from "@/components/Toast";

interface Props {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const { flash } = usePage().props as {
    flash?: { success?: string | null; error?: string | null };
  };

  const [toast, setToast] = useState<{
    message: string | null;
    type: "success" | "error" | null;
  }>({
    message: null,
    type: null,
  });

  useEffect(() => {
    if (flash?.success) {
      setToast({ message: flash.success, type: "success" });
    }
    if (flash?.error) {
      setToast({ message: flash.error, type: "error" });
    }
  }, [flash]);

  function logout() {
    router.post("/logout", {}, {
      onSuccess: () => {
        router.get("/admin/login");
      },
    });
  }

  return (
    <div className="min-h-screen flex bg-gray-100 text-black">

      {/* TOAST */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: null })}
      />

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A1A2F] text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-white/10">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-white/10 rounded">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="block px-4 py-2 hover:bg-white/10 rounded">
            Kelola Post
          </Link>
          <Link href="/admin/categories" className="block px-4 py-2 hover:bg-white/10 rounded">
            Kategori
          </Link>
          <Link href="/admin/tags" className="block px-4 py-2 hover:bg-white/10 rounded">
            Tag
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 hover:bg-red-600 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow px-8 py-4">
          <h1 className="font-semibold text-lg text-[#0A1A2F]">
            {title ?? "Admin Dashboard"}
          </h1>
        </header>

        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
