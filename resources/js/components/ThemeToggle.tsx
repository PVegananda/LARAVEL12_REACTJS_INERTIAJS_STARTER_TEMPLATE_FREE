import useTheme from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        px-4 py-2 rounded-lg text-sm font-semibold
        transition bg-gray-200 dark:bg-gray-700 
        text-gray-900 dark:text-white hover:opacity-80
      "
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
