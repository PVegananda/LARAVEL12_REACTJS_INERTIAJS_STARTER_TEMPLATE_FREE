<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Halaman homepage (landing blog)
     */
    public function home()
    {
        // Ambil 6 artikel terbaru untuk homepage
        $posts = Post::with('category')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'slug' => $p->slug,
                    'thumbnail_url' => $p->thumbnail ? asset("storage/" . $p->thumbnail) : null,
                    'created_at' => $p->created_at,
                    'category' => $p->category ? [
                        'id' => $p->category->id,
                        'name' => $p->category->name
                    ] : null,
                ];
            });

        return Inertia::render('Home', [
            'posts' => $posts,
        ]);
    }

    /**
     * Halaman daftar semua artikel
     */
    public function posts(Request $request)
    {
        $search = $request->query('search');

        $query = Post::with('category')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        $posts = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'excerpt' => substr(strip_tags($p->content), 0, 160) . "...",
                'thumbnail_url' => $p->thumbnail ? asset("storage/" . $p->thumbnail) : null,
                'created_at' => $p->created_at,
                'category' => $p->category ? [
                    'id' => $p->category->id,
                    'name' => $p->category->name
                ] : null,
            ];
        });

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => Category::select('id', 'name')->get(),
        ]);
    }

    /**
     * Halaman artikel single
     */
    public function show($slug)
    {
        $post = Post::with(['category', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Post::where('id', '!=', $post->id)
        ->where('category_id', $post->category_id)
        ->latest()
        ->take(3)
        ->get()
        ->map(fn ($p) => [
            'id' => $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'thumbnail_url' => $p->thumbnail ? asset("storage/{$p->thumbnail}") : null,
            'created_at' => $p->created_at,
        ]);
        $postData = [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'content' => $post->content,
            'created_at' => $post->created_at,
            'thumbnail_url' => $post->thumbnail ? asset("storage/" . $post->thumbnail) : null,
            'category' => $post->category ? [
                'id' => $post->category->id,
                'name' => $post->category->name
            ] : null,
            'tags' => $post->tags->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name
            ]),
        ];

        return Inertia::render('Posts/Show', [
            'post' => $postData,
            'related' => $related,
        ]);

    }

    /**
     * Halaman About
     */
    public function about()
    {
        return Inertia::render('About');
    }
}
