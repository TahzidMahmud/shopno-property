<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $posts = BlogPost::orderBy('order')->get();
        return response()->json($posts, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'published_date' => 'required|date',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'is_published' => 'nullable|in:0,1,true,false',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/home/blog'
            );
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $validated['order'] = $validated['order'] ?? BlogPost::max('order') + 1;
        // Convert string boolean to actual boolean
        $validated['is_published'] = filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);

        $post = BlogPost::create($validated);
        return response()->json(['message' => 'Blog post created successfully', 'data' => $post], 201);
    }

    public function show(string $id)
    {
        $post = BlogPost::findOrFail($id);
        return response()->json($post, 200);
    }

    public function update(Request $request, string $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'published_date' => 'required|date',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $id,
            'is_published' => 'nullable|in:0,1,true,false',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            if ($post->image) {
                $this->fileUploadService->deleteFile($post->image);
            }
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/home/blog'
            );
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_published')) {
            $validated['is_published'] = filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN);
        }

        $post->update($validated);
        return response()->json(['message' => 'Blog post updated successfully', 'data' => $post], 200);
    }

    public function destroy(string $id)
    {
        $post = BlogPost::findOrFail($id);
        
        if ($post->image) {
            $this->fileUploadService->deleteFile($post->image);
        }
        
        $post->delete();
        return response()->json(['message' => 'Blog post deleted successfully'], 200);
    }
}
