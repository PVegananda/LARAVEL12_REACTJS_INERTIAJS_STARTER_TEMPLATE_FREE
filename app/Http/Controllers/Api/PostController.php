<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index()
{
    return Post::latest()->get();
}

public function store(Request $request)
{
    $request->validate([
        'title' => 'required',
        'content' => 'required'
    ]);

    Post::create([
        'title' => $request->title,
        'slug' => Str::slug($request->title),
        'content' => $request->content
    ]);

    return response()->json(['message' => 'Post created']);
}
}
