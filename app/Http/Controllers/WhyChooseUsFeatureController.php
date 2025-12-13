<?php

namespace App\Http\Controllers;

use App\Models\WhyChooseUsFeature;
use Illuminate\Http\Request;
use App\Services\FileUploadService;

class WhyChooseUsFeatureController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $features = WhyChooseUsFeature::orderBy('order')->get();
        return response()->json($features, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'video_url' => 'nullable|string|url|max:500',
            'video_thumbnail' => 'nullable|image|max:2048',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        // Handle video thumbnail upload
        if ($request->hasFile('video_thumbnail')) {
            $validated['video_thumbnail'] = $this->fileUploadService->uploadFile(
                $request->file('video_thumbnail'),
                'uploads/why-choose-us/video-thumbnails'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $validated['order'] = $validated['order'] ?? WhyChooseUsFeature::max('order') + 1;
        $validated['is_active'] = $validated['is_active'] ?? false;

        $feature = WhyChooseUsFeature::create($validated);
        return response()->json(['message' => 'Feature created successfully', 'data' => $feature], 201);
    }

    public function show(string $id)
    {
        $feature = WhyChooseUsFeature::findOrFail($id);
        return response()->json($feature, 200);
    }

    public function update(Request $request, string $id)
    {
        $feature = WhyChooseUsFeature::findOrFail($id);

        $validated = $request->validate([
            'icon_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'video_url' => 'nullable|string|url|max:500',
            'video_thumbnail' => 'nullable|image|max:2048',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        // Handle video thumbnail upload
        if ($request->hasFile('video_thumbnail')) {
            // Delete old thumbnail
            if ($feature->video_thumbnail) {
                $this->fileUploadService->deleteFile($feature->video_thumbnail);
            }
            // Upload new thumbnail
            $validated['video_thumbnail'] = $this->fileUploadService->uploadFile(
                $request->file('video_thumbnail'),
                'uploads/why-choose-us/video-thumbnails'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $feature->update($validated);
        return response()->json(['message' => 'Feature updated successfully', 'data' => $feature], 200);
    }

    public function destroy(string $id)
    {
        $feature = WhyChooseUsFeature::findOrFail($id);
        
        // Delete video thumbnail if exists
        if ($feature->video_thumbnail) {
            $this->fileUploadService->deleteFile($feature->video_thumbnail);
        }
        
        $feature->delete();
        return response()->json(['message' => 'Feature deleted successfully'], 200);
    }
}
