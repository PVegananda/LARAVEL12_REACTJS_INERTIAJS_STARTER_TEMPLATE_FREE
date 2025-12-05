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

/* TYPES */
interface Category {
  id: number;
  name: string;
}
interface Tag {
  id: number;
  name: string;
}

interface EditProps extends Record<string, any> {
  post: any;
  categories: Category[];
  tags: Tag[];
}

interface PostFormData extends Record<string, any> {
  title: string;
  content: string;
  thumbnail: File | null;
  category_id: string;
  status: "published" | "draft";
  tags: number[];
}

export default function Edit() {
  const { post, categories = [], tags = [] } = usePage<EditProps>().props;

  const { data, setData, put, errors } = useForm<PostFormData>({
    title: post.title,
    content: post.content,
    thumbnail: null,
    status: post.status ?? "published",
    category_id: post.category_id ?? "",
    tags: post.tags?.map((t: any) => t.id) ?? [],
  });

  const [preview, setPreview] = useState<string | null>(post.thumbnail_url ?? null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlock,
    ],
    content: post.content,
    onUpdate({ editor }) {
      setData("content", editor.getHTML());
    },
  });

  function toggleTag(tagId: number) {
    if (data.tags.includes(tagId)) {
      setData("tags", data.tags.filter((id) => id !== tagId));
    } else {
      setData("tags", [...data.tags, tagId]);
    }
  }

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setData("thumbnail", file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(`/admin/posts/${post.id}`, { forceFormData: true });
  }

  return (
    <AdminLayout title="Edit Post">
      <Head title="Edit Post" />

      <div className="max-w-5xl mx-auto">
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
          <h1 className="text-3xl font-bold text-[#0A1A2F]">Edit Post</h1>

          {/* TITLE */}
          <div>
            <label className="block mb-2 font-semibold text-black">Judul</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl text-black"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <label className="block mb-2 font-semibold text-black">Thumbnail</label>

            <div className="flex flex-col gap-3">
              <div className="w-48 h-32 border bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Belum ada gambar</span>
                )}
              </div>

              <label
                htmlFor="thumbnail"
                className="bg-[#0A1A2F] text-white px-4 py-2 rounded cursor-pointer hover:bg-black"
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
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 font-semibold text-black">Kategori</label>

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
          </div>

          {/* TAGS DROPDOWN */}
          <div className="relative">
            <label className="block mb-2 font-semibold text-black">Tags</label>

            <button
              type="button"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl text-left"
            >
              {data.tags.length > 0
                ? `${data.tags.length} tag dipilih`
                : "Pilih Tag"}
            </button>

            {showTagDropdown && (
              <div className="absolute z-30 mt-2 w-full bg-white shadow-md rounded-xl border p-3 max-h-60 overflow-y-auto">
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    <input
                      type="checkbox"
                      checked={data.tags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* EDITOR */}
          <div>
            <label className="block mb-2 font-semibold text-black">Konten</label>

            <EditorToolbar editor={editor} />

            <div className="border border-gray-300 rounded-b-xl min-h-[300px]">
              <div className="p-4 text-black min-h-[240px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-2 font-semibold text-black">Status</label>

            <select
              value={data.status}
              onChange={(e) =>
                setData("status", e.target.value as "published" | "draft")
              }
              className="w-48 bg-gray-100 border border-gray-300 p-2 rounded-md"
            >
              <option value="published">Published</option>
              <option value="draft">Draft (Unpublished)</option>
            </select>
          </div>

          <button className="bg-[#0A1A2F] hover:bg-black text-white px-6 py-3 rounded-lg">
            Update Post
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
