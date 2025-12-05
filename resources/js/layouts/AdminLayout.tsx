import { ReactNode } from "react";
import { Link } from "@inertiajs/react";

interface Props {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  return (
    <div className="min-h-screen flex bg-gray-100 text-black">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A1A2F] text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-white/10">
        Admin Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/admin/dashboard"
          className="block px-4 py-2 rounded hover:bg-white/10 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/admin/posts"
          className="block px-4 py-2 rounded hover:bg-white/10 transition"
        >
          Kelola Post
        </Link>

        {/* NEW: PROFILE MENU */}
        <Link
          href="/admin/profile"
          className="block px-4 py-2 rounded hover:bg-white/10 transition"
        >
          Profile
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <form method="post" action="/logout">
          <button className="w-full text-left px-4 py-2 rounded hover:bg-red-600 transition">
            Logout
          </button>
        </form>
      </div>
    </aside>


      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white shadow px-8 py-4">
          <h1 className="font-semibold text-lg text-[#0A1A2F]">
            {title ?? "Admin Dashboard"}
          </h1>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
