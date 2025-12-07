import { Editor } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";


interface Props {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-t-xl bg-gray-100 p-2 flex flex-wrap gap-2">

      {/* Paragraph */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className="px-2 py-1 border rounded"
      >
        P
      </button>

      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="px-2 py-1 border rounded"
      >
        B
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="px-2 py-1 border rounded"
      >
        I
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="px-2 py-1 border rounded"
      >
        U
      </button>

      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 border rounded">H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="px-2 py-1 border rounded">H3</button>

      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">• List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. List</button>

      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className="px-2 py-1 border rounded">Left</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className="px-2 py-1 border rounded">Center</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className="px-2 py-1 border rounded">Right</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className="px-2 py-1 border rounded">Justify</button>

      {/* Quote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="px-2 py-1 border rounded"
      >
        ❝
      </button>

      {/* HR */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-2 py-1 border rounded"
      >
        HR
      </button>

      {/* Code Block */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className="px-2 py-1 border rounded"
      >
        {"</>"}
      </button>

      {/* Clear formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="px-2 py-1 border rounded"
      >
        Clear
      </button>

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          const url = prompt("Masukkan URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className="px-2 py-1 border rounded"
      >
        Link
      </button>

      {/* Image */}
      <button
        type="button"
        onClick={() => {
          const url = prompt("Masukkan URL Gambar:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="px-2 py-1 border rounded"
      >
        🖼️
      </button>
    </div>
  );
}
