import { Head, useForm } from "@inertiajs/react";

export default function AdminLogin() {
  const { data, setData, post, errors, processing } = useForm({
    email: "",
    password: "",
  });

  function submit(e: any) {
    e.preventDefault();
    post("/login", {
      onSuccess: () => {
        // backend sudah redirect intended() ke /admin/dashboard
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1A2F] to-black">
      <Head title="Admin Login" />

      <form
        onSubmit={submit}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A1A2F]">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-2">
            Login untuk mengelola konten blog
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0A1A2F]"
            placeholder="admin@gmail.com"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0A1A2F]"
            placeholder="••••••••"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          disabled={processing}
          className="w-full bg-[#0A1A2F] hover:bg-black transition text-white py-3 rounded-lg font-semibold"
        >
          {processing ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Admin System
        </p>
      </form>
    </div>
  );
}
