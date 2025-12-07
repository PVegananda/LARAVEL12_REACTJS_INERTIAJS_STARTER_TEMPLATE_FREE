import { Head, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { useRef, useState } from "react";

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

export default function Create() {
  const page = usePage<any>().props;

  const categories: Category[] = page.categories ?? [];
  const tags: Tag[] = page.tags ?? [];

  const { data, setData, post, errors } = useForm({
    title: "",
    content: "",
    thumbnail: null as File | null,
    status: "published",
    category_id: "",
    tags: [] as number[],
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const [popup, setPopup] = useState<{
    type: "link" | "image" | null;
    visible: boolean;
  }>({ type: null, visible: false });

  const [popupInput, setPopupInput] = useState("");

  /* ----------------------------------------------------
      INSERT HTML INTO TEXTAREA
  ---------------------------------------------------- */
  function insert(html: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.value =
      textarea.value.substring(0, start) +
      html +
      textarea.value.substring(end);

    textarea.selectionStart = textarea.selectionEnd = start + html.length;

    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    setData("content", textarea.value);
  }

  /* ----------------------------------------------------
      FORMAT BUTTONS
  ---------------------------------------------------- */
  function addParagraph() {
    insert("<p></p>\n");
  }

  function addBold() {
    insert("<b></b>");
  }

  function addItalic() {
    insert("<i></i>");
  }

  function addUnderline() {
    insert("<u></u>");
  }

  function addHeading(level: number) {
    insert(`<h${level}></h${level}>`);
  }

  function addList() {
    insert("<ul>\n  <li></li>\n</ul>\n");
  }

  function addOrderedList() {
    insert("<ol>\n  <li></li>\n</ol>\n");
  }

  function addAlignLeft() {
    insert(`<div style="text-align:left"></div>`);
  }

  function addAlignCenter() {
    insert(`<div style="text-align:center"></div>`);
  }

  function addAlignRight() {
    insert(`<div style="text-align:right"></div>`);
  }

  function addAlignJustify() {
    insert(`<div style="text-align:justify"></div>`);
  }

  function addQuote() {
    insert("<blockquote></blockquote>");
  }

  function addHR() {
    insert("<hr />");
  }

  function addCode() {
    insert("<code></code>");
  }

  function addCodeBlock() {
    insert("<pre><code></code></pre>\n");
  }

  /* ----------------------------------------------------
      POPUP FOR LINK & IMAGE
  ---------------------------------------------------- */
  function openPopup(type: "link" | "image") {
    setPopup({ type, visible: true });
    setPopupInput("");
  }

  function submitPopup() {
    if (!popupInput.trim()) return;

    if (popup.type === "link") {
      insert(`<a href="${popupInput}" target="_blank">${popupInput}</a>`);
    }

    if (popup.type === "image") {
      insert(`<img src="${popupInput}" alt="" />`);
    }

    setPopup({ type: null, visible: false });
    setPopupInput("");
  }

  /* ----------------------------------------------------
      TAG SELECT LOGIC
  ---------------------------------------------------- */
  function toggleTag(id: number) {
    if (data.tags.includes(id)) {
      setData(
        "tags",
        data.tags.filter((t) => t !== id)
      );
    } else {
      setData("tags", [...data.tags, id]);
    }
  }

  /* ----------------------------------------------------
      THUMBNAIL UPLOAD
  ---------------------------------------------------- */
  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setData("thumbnail", file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  /* ----------------------------------------------------
      FORM SUBMIT
  ---------------------------------------------------- */
  function submit(e: any) {
    e.preventDefault();
    post("/admin/posts", {
  forceFormData: true,
  onSuccess: () => {
    setPreview(null);
  },
});

}


  /* ----------------------------------------------------
      UI START
  ---------------------------------------------------- */
  return (
    <AdminLayout title="Tambah Post">
      <Head title="Tambah Post" />

      {/* POPUP OVERLAY */}
      {popup.visible && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="font-bold text-lg mb-4 text-[#0A1A2F]">
              {popup.type === "link"
                ? "Masukkan URL Link"
                : "Masukkan URL Gambar"}
            </h2>

            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder={
                popup.type === "link"
                  ? "https://example.com"
                  : "https://image-url.jpg"
              }
              value={popupInput}
              onChange={(e) => setPopupInput(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPopup({ type: null, visible: false })}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitPopup}
                className="px-4 py-2 rounded-lg bg-[#0A1A2F] text-white"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="max-w-6xl mx-auto">
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
            <label className="block mb-2 font-semibold">Judul</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* THUMBNAIL */}
        <div>
            <label className="block mb-2 font-semibold">Thumbnail</label>

            <div className="flex flex-col items-start gap-3">
                
                {/* Preview */}
                <div className="w-48 h-32 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-sm">Belum ada gambar</span>
                )}
                </div>

                {/* File input */}
                <label
                htmlFor="thumbnail"
                className="cursor-pointer bg-[#0A1A2F] hover:bg-black text-white px-4 py-2 rounded-md text-sm shadow"
                >
                Pilih Gambar
                </label>

                <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setData("thumbnail", file);

                    if (file) {
                    setPreview(URL.createObjectURL(file));
                    }
                }}
                />

                {errors.thumbnail && (
                <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
                )}
            </div>
        </div>


          {/* CATEGORY */}
          <div>
            <label className="block mb-2 font-semibold">Kategori</label>
            <select
              value={data.category_id}
              onChange={(e) => setData("category_id", e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category_id}
              </p>
            )}
          </div>

          {/* TAGS */}
          <div className="relative">
            <label className="block mb-2 font-semibold">Tags</label>

            <button
              type="button"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-xl text-left"
            >
              {data.tags.length
                ? `${data.tags.length} tag dipilih`
                : "Pilih Tag"}
            </button>

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
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* NOTES / PANDUAN */}
          <div className="p-4 mb-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
            <h3 className="text-lg font-semibold">Panduan Penulisan Konten</h3>
            <p className="text-sm">
              Gunakan tombol-tombol di toolbar untuk memformat artikel agar lebih
              rapi dan mudah dibaca. Berikut fungsi singkatnya:
            </p>

            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>
                <b>P</b> – Paragraf: <code>&lt;p&gt;...&lt;/p&gt;</code>
              </li>
              <li>
                <b>Bold / Italic / Underline</b> – Penekanan teks.
              </li>
              <li>
                <b>H1 / H2 / H3</b> – Judul besar, sedang, kecil.
              </li>
              <li>
                <b>• List / 1. List</b> – Bullet dan numbered list.
              </li>
              <li>
                <b>Left / Center / Right / Justify</b> – Perataan teks.
              </li>
              <li>
                <b>Quote</b> – Blok kutipan.
              </li>
              <li>
                <b>HR</b> – Garis pemisah.
              </li>
              <li>
                <b>Code / Code Block</b> – Untuk potongan kode.
              </li>
              <li>
                <b>Link</b> – Tautan ke halaman lain.
              </li>
              <li>
                <b>Image</b> – Menambahkan gambar dari URL.
              </li>
            </ul>

            <p className="text-xs mt-2 text-blue-700">
              Tips: gunakan paragraf pendek, judul yang jelas, dan gambar
              seperlunya agar artikel nyaman dibaca.
            </p>
          </div>

          {/* EDITOR */}
          <div>
            <label className="block mb-2 font-semibold">Konten (HTML)</label>

            {/* TOOLBAR */}
            <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-300 rounded-t-xl">
              {/* Paragraph */}
              <button
                type="button"
                onClick={addParagraph}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                P
              </button>

              {/* Bold */}
              <button
                type="button"
                onClick={addBold}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Bold
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={addItalic}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Italic
              </button>

              {/* Underline */}
              <button
                type="button"
                onClick={addUnderline}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Underline
              </button>

              {/* Headings */}
              <button
                type="button"
                onClick={() => addHeading(1)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => addHeading(2)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => addHeading(3)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                H3
              </button>

              {/* Lists */}
              <button
                type="button"
                onClick={addList}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                • List
              </button>

              <button
                type="button"
                onClick={addOrderedList}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                1. List
              </button>

              {/* Alignment */}
              <button
                type="button"
                onClick={addAlignLeft}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Left
              </button>

              <button
                type="button"
                onClick={addAlignCenter}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Center
              </button>

              <button
                type="button"
                onClick={addAlignRight}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Right
              </button>

              <button
                type="button"
                onClick={addAlignJustify}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Justify
              </button>

              {/* Quote */}
              <button
                type="button"
                onClick={addQuote}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Quote
              </button>

              {/* HR */}
              <button
                type="button"
                onClick={addHR}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                HR
              </button>

              {/* Code */}
              <button
                type="button"
                onClick={addCode}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Code
              </button>

              <button
                type="button"
                onClick={addCodeBlock}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Code Block
              </button>

              {/* Link */}
              <button
                type="button"
                onClick={() => openPopup("link")}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Link
              </button>

              {/* Image */}
              <button
                type="button"
                onClick={() => openPopup("image")}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Image
              </button>
            </div>

            {/* TEXTAREA */}
            <textarea
              ref={textareaRef}
              value={data.content}
              onChange={(e) => setData("content", e.target.value)}
              className="w-full border border-gray-300 rounded-b-xl bg-white p-4 min-h-[300px] font-mono text-sm"
            />

            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-2 font-semibold">Status</label>
            <select
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
              className="w-48 bg-gray-100 border border-gray-300 p-2 rounded-md"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
            >
              Batal
            </a>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
