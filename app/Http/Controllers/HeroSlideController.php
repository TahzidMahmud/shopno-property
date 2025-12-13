<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class HeroSlideController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $slides = HeroSlide::orderBy('order')->get();
        return response()->json($slides, 200);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'button_text' => 'required|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'background_image' => 'required|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        if ($request->hasFile('background_image')) {
            $validated['background_image'] = $this->fileUploadService->uploadFile(
                $request->file('background_image'),
                'uploads/home/hero'
            );
        }

        $validated['order'] = $validated['order'] ?? HeroSlide::max('order') + 1;
        // Convert string boolean to actual boolean
        $validated['is_active'] = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

        $slide = HeroSlide::create($validated);
        return response()->json(['message' => 'Hero slide created successfully', 'data' => $slide], 201);
    }

    public function show(string $id)
    {
        $slide = HeroSlide::findOrFail($id);
        return response()->json($slide, 200);
    }

    public function update(Request $request, string $id)
    {
        $slide = HeroSlide::findOrFail($id);

        // Debug: Check what we're receiving
        Log::info('HeroSlide Update Request', [
            'method' => $request->method(),
            'all' => $request->all(),
            'input_title' => $request->input('title'),
            'has_file' => $request->hasFile('background_image'),
            'content_type' => $request->header('Content-Type'),
            'raw_content_length' => $request->header('Content-Length'),
        ]);

        // Exclude _method from validation if present (method spoofing)
        $validationRules = [
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'button_text' => 'required|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'background_image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|in:0,1,true,false',
        ];

        $validated = $request->validate($validationRules);

        if ($request->hasFile('background_image')) {
            if ($slide->background_image) {
                $this->fileUploadService->deleteFile($slide->background_image);
            }
            $validated['background_image'] = $this->fileUploadService->uploadFile(
                $request->file('background_image'),
                'uploads/home/hero'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $slide->update($validated);
        return response()->json(['message' => 'Hero slide updated successfully', 'data' => $slide], 200);
    }

    public function destroy(string $id)
    {
        $slide = HeroSlide::findOrFail($id);

        if ($slide->background_image) {
            $this->fileUploadService->deleteFile($slide->background_image);
        }

        $slide->delete();
        return response()->json(['message' => 'Hero slide deleted successfully'], 200);
    }
}
