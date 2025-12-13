<?php

namespace App\Http\Controllers;

use App\Models\AboutPageTestimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\FileUploadService;

class AboutPageTestimonialController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $testimonials = AboutPageTestimonial::orderBy('order')->get();
        return response()->json($testimonials, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote' => 'required|string',
            'author_name' => 'required|string|max:255',
            'author_position' => 'required|string|max:255',
            'author_company' => 'nullable|string|max:255',
            'rating' => 'nullable|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/about/testimonials'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $testimonial = AboutPageTestimonial::create($validated);
        return response()->json(['message' => 'Testimonial created successfully', 'data' => $testimonial], 201);
    }

    public function show($id)
    {
        $testimonial = AboutPageTestimonial::find($id);
        if (!$testimonial) {
            return response()->json(['message' => 'Testimonial not found'], 404);
        }
        return response()->json($testimonial, 200);
    }

    public function update(Request $request, $id)
    {
        $testimonial = AboutPageTestimonial::find($id);
        if (!$testimonial) {
            return response()->json(['message' => 'Testimonial not found'], 404);
        }

        $validated = $request->validate([
            'quote' => 'sometimes|required|string',
            'author_name' => 'sometimes|required|string|max:255',
            'author_position' => 'sometimes|required|string|max:255',
            'author_company' => 'nullable|string|max:255',
            'rating' => 'nullable|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($testimonial->image) {
                $this->fileUploadService->deleteFile($testimonial->image);
            }
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/about/testimonials'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $testimonial->update($validated);
        return response()->json(['message' => 'Testimonial updated successfully', 'data' => $testimonial], 200);
    }

    public function destroy($id)
    {
        $testimonial = AboutPageTestimonial::find($id);
        if (!$testimonial) {
            return response()->json(['message' => 'Testimonial not found'], 404);
        }

        if ($testimonial->image) {
            $this->fileUploadService->deleteFile($testimonial->image);
        }

        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted successfully'], 200);
    }
}
