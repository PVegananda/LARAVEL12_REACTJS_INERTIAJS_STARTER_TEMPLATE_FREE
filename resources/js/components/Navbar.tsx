import { Link } from "@inertiajs/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="w-full py-6 px-6 lg:px-10 flex justify-between items-center 
      bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] 
      dark:from-black dark:to-gray-900 
      shadow-lg sticky top-0 z-50 backdrop-blur-xl">

      <Link href="/" className="text-2xl font-extrabold tracking-wide text-white">
        Dearetna
      </Link>

      <nav className="flex items-center gap-6 text-sm font-medium text-gray-200">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>

        <Link href="/posts" className="hover:text-white transition">
          All Posts
        </Link>

        <Link href="/about" className="hover:text-white transition">
          About
        </Link>

        <ThemeToggle />
      </nav>
    </header>
  );
}
