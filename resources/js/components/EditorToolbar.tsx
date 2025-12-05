import type { Editor } from "@tiptap/react";

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btn =
    "px-3 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm font-medium transition";
  const active =
    "px-3 py-1 rounded-lg bg-[#0A1A2F] text-white text-sm font-medium transition";

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-300 rounded-t-xl">
      <button className={editor.isActive("bold") ? active : btn} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button className={editor.isActive("italic") ? active : btn} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button className={editor.isActive("underline") ? active : btn} onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>

      <button className={editor.isActive("heading", { level: 1 }) ? active : btn} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button className={editor.isActive("heading", { level: 2 }) ? active : btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button className={editor.isActive("heading", { level: 3 }) ? active : btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

      <button className={editor.isActive("bulletList") ? active : btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button className={editor.isActive("orderedList") ? active : btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>

      <button className={btn} onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</button>
      <button className={btn} onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</button>
      <button className={btn} onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</button>

      <button
        className={btn}
        onClick={() => {
          const url = prompt("Masukkan URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        Link
      </button>

      <button
        className={btn}
        onClick={() => {
          const url = prompt("URL gambar:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        Image
      </button>

      <button className={btn} onClick={() => editor.chain().focus().undo().run()}>Undo</button>
      <button className={btn} onClick={() => editor.chain().focus().redo().run()}>Redo</button>
    </div>
  );
}
