<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // basic stats
        $totalPosts = Post::count();
        $published = Post::where('status', 'published')->count();
        $drafts = Post::where('status', 'draft')->count();

        // latest + recent (include category & tags)
        $latestPost = Post::with('category','tags')->latest()->first();
        $recentPosts = Post::with('category','tags')->latest()->take(5)->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'created_at' => $post->created_at,
                'thumbnail_url' => $post->thumbnail ? asset('storage/' . $post->thumbnail) : null,
                'status' => $post->status,
                'category' => $post->category ? ['id' => $post->category->id, 'name' => $post->category->name] : null,
                'tags' => $post->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name])->toArray(),
            ];
        });

        // categories & tags for filters
        $categories = Category::orderBy('name')->get(['id','name']);
        $tags = Tag::orderBy('name')->get(['id','name']);

        return Inertia::render('Admin/Dashboard', [
            'totalPosts' => $totalPosts,
            'published' => $published,
            'drafts' => $drafts,
            'latestPost' => $latestPost ? [
                'id' => $latestPost->id,
                'title' => $latestPost->title,
                'created_at' => $latestPost->created_at,
            ] : null,
            'recentPosts' => $recentPosts,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }
}
