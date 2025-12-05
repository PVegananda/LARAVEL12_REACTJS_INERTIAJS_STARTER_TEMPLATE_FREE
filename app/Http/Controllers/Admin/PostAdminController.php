<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostAdminController extends Controller
{
    /**
     * INDEX — Tampilkan semua post untuk admin
     */
    public function index(Request $request)
    {
        // get filters from query
        $search = $request->query('search');
        $categoryId = $request->query('category');
        $tagId = $request->query('tag');
        $status = $request->query('status'); // published | draft | null
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('dir', 'desc'); // asc|desc
        $perPage = (int) $request->query('per_page', 10);

        $query = Post::with('category','tags')->latest();

        // base ordering
        if (in_array($sort, ['title','created_at','status'])) {
            $query = Post::with('category','tags')->orderBy($sort, $direction);
        } else {
            $query = Post::with('category','tags')->orderBy('created_at', 'desc');
        }

        // apply search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // category filter
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // tag filter (posts that have the tag)
        if ($tagId) {
            $query->whereHas('tags', function($q) use ($tagId) {
                $q->where('tags.id', $tagId);
            });
        }

        // status filter
        if (in_array($status, ['published','draft'])) {
            $query->where('status', $status);
        }

        $posts = $query->paginate($perPage)->withQueryString();

        // map to lean payload
        $postsTransformed = $posts->through(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'created_at' => $post->created_at,
                'status' => $post->status,
                'thumbnail_url' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
                'category' => $post->category ? ['id'=>$post->category->id,'name'=>$post->category->name] : null,
                'tags' => $post->tags->map(fn($t)=>['id'=>$t->id,'name'=>$t->name])->toArray(),
            ];
        });

        // categories & tags for filters
        $categories = Category::orderBy('name')->get(['id','name']);
        $tags = Tag::orderBy('name')->get(['id','name']);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $postsTransformed,
            'categories' => $categories,
            'tags' => $tags,
            // echo filters so frontend can show current values
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'tag' => $tagId,
                'status' => $status,
                'sort' => $sort,
                'dir' => $direction,
                'per_page' => $perPage,
            ]
        ]);
    }

    // other methods (create, store, edit, update, destroy) assumed already implemented

    // Bulk delete route handler (expects ids[] in request)
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || count($ids) === 0) {
            return back()->with('error', 'No posts selected.');
        }

        // delete thumbnails
        $posts = Post::whereIn('id', $ids)->get();
        foreach ($posts as $post) {
            if ($post->thumbnail) {
                Storage::disk('public')->delete($post->thumbnail);
            }
        }

        Post::whereIn('id', $ids)->delete();

        return back()->with('success', count($ids) . ' post(s) deleted.');
    }
    /**
     * CREATE PAGE
     */
    public function create()
    {
        return Inertia::render('Admin/Posts/Create', [
            'categories' => Category::select('id', 'name')->get(),
            'tags'       => Tag::select('id', 'name')->get(),
        ]);
    }

    /**
     * STORE — Simpan post baru
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'nullable|string',
            'thumbnail'   => 'nullable|image|max:5120',
            'status'      => 'required|string|in:published,draft',
            'category_id' => 'nullable|exists:categories,id',
            'tags'        => 'array',
            'tags.*'      => 'exists:tags,id',
        ]);

        // Upload thumbnail jika ada
        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')
                ->store('thumbnails', 'public');
        }

        // Slug unik
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);

        // Buat post
        $post = Post::create($data);

        // RELASI TAGS
        if (!empty($data['tags'])) {
            $post->tags()->attach($data['tags']);
        }

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post berhasil dibuat.');
    }

    /**
     * EDIT PAGE
     */
    public function edit(Post $post)
    {
        $post->thumbnail_url = $post->thumbnail
            ? asset('storage/' . $post->thumbnail)
            : null;

        return Inertia::render('Admin/Posts/Edit', [
            'post'       => $post->load(['category', 'tags']),
            'categories' => Category::select('id', 'name')->get(),
            'tags'       => Tag::select('id', 'name')->get(),
        ]);
    }

    /**
     * UPDATE — Perbarui data post
     */
    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'nullable|string',
            'thumbnail'   => 'nullable|image|max:5120',
            'status'      => 'required|string|in:published,draft',
            'category_id' => 'nullable|exists:categories,id',
            'tags'        => 'array',
            'tags.*'      => 'exists:tags,id',
        ]);

        // Jika update thumbnail
        if ($request->hasFile('thumbnail')) {
            if ($post->thumbnail) {
                Storage::disk('public')->delete($post->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')
                ->store('thumbnails', 'public');
        }

        // Update slug jika title berubah
        if ($post->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        }

        $post->update($data);

        // Sync tags
        $post->tags()->sync($data['tags'] ?? []);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post berhasil diperbarui.');
    }

    /**
     * DELETE — Hapus post
     */
    public function destroy(Post $post)
    {
        if ($post->thumbnail) {
            Storage::disk('public')->delete($post->thumbnail);
        }

        $post->tags()->detach();
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post berhasil dihapus.');
    }

    /**
     * TOGGLE STATUS — Published ↔ Draft
     */
    public function toggleStatus(Post $post)
    {
        $post->status = $post->status === 'published'
            ? 'draft'
            : 'published';

        $post->save();

        return response()->json([
            'status' => $post->status
        ]);
    }
}
