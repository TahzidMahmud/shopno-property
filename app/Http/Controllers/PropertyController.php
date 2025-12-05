<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\FileUploadService; // 🚨 Import the Service

class PropertyController extends Controller
{
    protected $fileUploadService;

    // 1. 🚨 Inject the FileUploadService into the controller
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    // 🟢 List all properties
    public function index()
    {
        return response()->json(Property::with('facilities')->get(), 200);
    }

    // 🟢 Create a new property
    public function store(Request $request)
    {
        // Validation remains the same, but the max size rules are now enforced here.
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'nullable|string',
            'area' => 'nullable|string',
            'location' => 'nullable|string',
            'type' => 'nullable|string',
            'total_floor' => 'nullable|integer',
            'total_flat' => 'nullable|integer',
            'flat_size' => 'nullable|integer',
            'total_parking' => 'nullable|integer',
            'price_range' => 'nullable|string',
            'main_image' => 'nullable|image|max:2048',
            'layout_images.*' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
            'demo_video' => 'nullable|mimetypes:video/mp4,video/mpeg,video/quicktime|max:100000',
            'full_address' => 'nullable|string',
            'key_transports' => 'nullable|array',
            'under_development' => 'nullable|string',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'company_name' => 'nullable|string|max:255',
            'facilities' => 'nullable|array',
            'facilities.*' => 'exists:facilities,id',
        ]);

        // 2. 🚨 Use the Service for single image upload (WebP conversion happens inside the service)
        if ($request->hasFile('main_image')) {
            $validated['main_image'] = $this->fileUploadService->uploadFile(
                $request->file('main_image'),
                'uploads/properties/main' // Public path segment
            );
        }

        // 3. 🚨 Use the Service for multiple images
        if ($request->hasFile('layout_images')) {
            $validated['layout_images'] = $this->fileUploadService->uploadMultipleFiles(
                $request->file('layout_images'),
                'uploads/properties/layouts'
            );
            // Laravel stores arrays of paths as JSON automatically if cast is set on the model
            // or you can manually encode: $validated['layout_images'] = json_encode($validated['layout_images']);
        }

        if ($request->hasFile('gallery_images')) {
            $validated['gallery_images'] = $this->fileUploadService->uploadMultipleFiles(
                $request->file('gallery_images'),
                'uploads/properties/gallery'
            );
        }

        // 4. 🚨 Use the Service for video upload (handled as non-image)
        if ($request->hasFile('demo_video')) {
            $validated['demo_video'] = $this->fileUploadService->uploadFile(
                $request->file('demo_video'),
                'uploads/properties/videos'
            );
        }

        // Extract facilities from validated data
        $facilities = $validated['facilities'] ?? [];
        unset($validated['facilities']);

        $property = Property::create($validated);

        // Attach facilities to property
        if (!empty($facilities)) {
            $property->facilities()->attach($facilities);
        }

        // Load facilities relationship for response
        $property->load('facilities');

        return response()->json(['message' => 'Property created successfully', 'data' => $property], 201);
    }

    // 🟢 Show single property
    public function show($id)
    {
        $property = Property::with('facilities')->find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }
        return response()->json($property, 200);
    }

    // 🟢 Update property
    public function update(Request $request, $id)
    {
        $property = Property::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'status' => 'nullable|string',
            'area' => 'nullable|string',
            'location' => 'nullable|string',
            'type' => 'nullable|string',
            'total_floor' => 'nullable|integer',
            'total_flat' => 'nullable|integer',
            'flat_size' => 'nullable|integer',
            'total_parking' => 'nullable|integer',
            'price_range' => 'nullable|string',
            'main_image' => 'nullable|image|max:2048',
            'layout_images.*' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
            'demo_video' => 'nullable|mimetypes:video/mp4,video/mpeg,video/quicktime|max:100000',
            'full_address' => 'nullable|string',
            'key_transports' => 'nullable|array',
            'under_development' => 'nullable|string',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'company_name' => 'nullable|string|max:255',
            'facilities' => 'nullable|array',
            'facilities.*' => 'exists:facilities,id',
        ]);

        // 5. 🚨 Update: Handle single file uploads (delete old, upload new)
        if ($request->hasFile('main_image')) {
            // Delete old file using the path stored in the database
            if ($property->main_image) Storage::disk('public')->delete($property->main_image);

            // Upload new file via service (includes WebP conversion)
            $validated['main_image'] = $this->fileUploadService->uploadFile(
                $request->file('main_image'),
                'uploads/properties/main'
            );
        }

        if ($request->hasFile('demo_video')) {
            // Delete old video
            if ($property->demo_video) Storage::disk('public')->delete($property->demo_video);

            // Upload new video via service
            $validated['demo_video'] = $this->fileUploadService->uploadFile(
                $request->file('demo_video'),
                'uploads/properties/videos'
            );
        }

        // 6. 🚨 Update: Handle multiple file uploads (NOTE: This implementation ADDS images, it doesn't replace the whole list.)
        if ($request->hasFile('layout_images')) {
            $newLayoutPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('layout_images'),
                'uploads/properties/layouts'
            );

            // Merge new paths with existing ones (assuming paths are stored as JSON/array in the model)
            $existingLayouts = json_decode($property->layout_images ?? '[]', true);
            $validated['layout_images'] = array_merge($existingLayouts, $newLayoutPaths);

            // Ensure this is encoded if your model doesn't use the 'array' cast
            // $validated['layout_images'] = json_encode($validated['layout_images']);
        }

        if ($request->hasFile('gallery_images')) {
            $newGalleryPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('gallery_images'),
                'uploads/properties/gallery'
            );

            $existingGallery = json_decode($property->gallery_images ?? '[]', true);
            $validated['gallery_images'] = array_merge($existingGallery, $newGalleryPaths);

            // Ensure this is encoded if your model doesn't use the 'array' cast
            // $validated['gallery_images'] = json_encode($validated['gallery_images']);
        }


        // Extract facilities from validated data
        $facilities = $validated['facilities'] ?? null;
        unset($validated['facilities']);

        $property->update($validated);

        // Sync facilities to property (replace existing with new ones)
        if ($facilities !== null) {
            $property->facilities()->sync($facilities);
        }

        // Load facilities relationship for response
        $property->load('facilities');

        return response()->json(['message' => 'Property updated successfully', 'data' => $property], 200);
    }

    // 🟢 Delete property
    public function destroy($id)
    {
        $property = Property::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        // Delete single files
        if ($property->main_image) Storage::disk('public')->delete($property->main_image);
        if ($property->demo_video) Storage::disk('public')->delete($property->demo_video);

        // 7. 🚨 Delete: Handle array/multiple images
        $layoutImages = json_decode($property->layout_images ?? '[]', true);
        foreach ($layoutImages as $path) {
            Storage::disk('public')->delete($path);
        }

        $galleryImages = json_decode($property->gallery_images ?? '[]', true);
        foreach ($galleryImages as $path) {
            Storage::disk('public')->delete($path);
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully'], 200);
    }
}
