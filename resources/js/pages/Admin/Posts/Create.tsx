import { Head, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import EditorToolbar from "@/components/EditorToolbar";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlock from "@tiptap/extension-code-block";

/* ---------------------------------------------
   TYPES
----------------------------------------------*/
interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface CreateProps extends Record<string, any> {
  categories: Category[];
  tags: Tag[];
}

interface PostFormData extends Record<string, any> {
  title: string;
  content: string;
  thumbnail: File | null;
  status: "published" | "draft";
  category_id: string;
  tags: number[];
}

/* ---------------------------------------------
   COMPONENT
----------------------------------------------*/
export default function Create() {
  const { categories = [], tags = [] } = usePage<CreateProps>().props;

  const { data, setData, post, errors } = useForm<PostFormData>({
    title: "",
    content: "",
    thumbnail: null,
    status: "published",
    category_id: "",
    tags: [],
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // handle editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlock,
    ],
    content: "",
    onUpdate({ editor }: { editor: Editor }) {
      setData("content", editor.getHTML());
    },
  });

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setData("thumbnail", file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  function toggleTag(tagId: number) {
    if (data.tags.includes(tagId)) {
      setData(
        "tags",
        data.tags.filter((id) => id !== tagId)
      );
    } else {
      setData("tags", [...data.tags, tagId]);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post("/admin/posts", { forceFormData: true });
  }

  return (
    <AdminLayout title="Tambah Post">
      <Head title="Tambah Post" />

      <div className="max-w-6xl mx-auto">
        {/* BACK */}
        <a
          href="/admin/posts"
          className="inline-block mb-6 text-[#0A1A2F] hover:underline text-sm"
        >
          ← Kembali
        </a>

        <form
          onSubmit={submit}
          className="bg-white rounded-xl shadow p-8 space-y-8 border border-gray-200 text-black"
        >
          <h1 className="text-3xl font-bold text-[#0A1A2F]">
            Tambah Post Baru
          </h1>

          {/* TITLE */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Judul
            </label>
            <input
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl text-black"
              placeholder="Masukkan judul artikel..."
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* THUMBNAIL */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Thumbnail
            </label>

            <div className="flex flex-col items-start gap-3">
              <div className="w-48 h-32 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">
                    Belum ada gambar
                  </span>
                )}
              </div>

              <label
                htmlFor="thumbnail"
                className="cursor-pointer bg-[#0A1A2F] hover:bg-black text-white px-4 py-2 rounded-md text-sm shadow"
              >
                Pilih Gambar
              </label>

              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnail}
              />

              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Kategori
            </label>

            <select
              value={data.category_id}
              onChange={(e) => setData("category_id", e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl text-black"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
            )}
          </div>

          {/* TAGS DROPDOWN */}
          <div className="relative">
            <label className="block mb-2 font-semibold text-black">
              Tags
            </label>

            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl text-left text-black"
            >
              {data.tags.length > 0
                ? `${data.tags.length} tag dipilih`
                : "Pilih Tag"}
            </button>

            {/* Dropdown List */}
            {showTagDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg p-3 max-h-60 overflow-y-auto">
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={data.tags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <span className="text-black">{tag.name}</span>
                  </label>
                ))}
              </div>
            )}

            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
            )}
          </div>

          {/* EDITOR */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Konten
            </label>

            <EditorToolbar editor={editor} />

            <div className="border border-gray-300 rounded-b-xl bg-white min-h-[300px] text-black">
              <div className="p-4 min-h-[250px]">
                <EditorContent editor={editor} />
              </div>
            </div>

            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Status
            </label>

            <select
              value={data.status}
              onChange={(e) =>
                setData("status", e.target.value as "published" | "draft")
              }
              className="w-48 bg-gray-100 border border-gray-300 p-2 rounded-md text-black"
            >
              <option value="published">Published</option>
              <option value="draft">Draft (Unpublished)</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#0A1A2F] hover:bg-black text-white px-6 py-3 rounded-xl shadow"
            >
              Simpan Post
            </button>

            <a
              href="/admin/posts"
              className="px-6 py-3 rounded-xl border border-gray-300 text-[#0A1A2F] hover:bg-gray-100"
            >
              Batal
            </a>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
