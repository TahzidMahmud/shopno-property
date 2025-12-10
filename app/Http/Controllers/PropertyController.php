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
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'key_transports' => 'nullable|array',
            'key_transports.*.name' => 'required_with:key_transports|string',
            'key_transports.*.icon' => 'required_with:key_transports|string',
            'key_transports.*.distance' => 'required_with:key_transports|string',
            'booking_form_background_image' => 'nullable|image|max:2048',
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

        // Handle booking form background image
        if ($request->hasFile('booking_form_background_image')) {
            $validated['booking_form_background_image'] = $this->fileUploadService->uploadFile(
                $request->file('booking_form_background_image'),
                'uploads/properties/booking'
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
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'key_transports' => 'nullable|array',
            'key_transports.*.name' => 'required_with:key_transports|string',
            'key_transports.*.icon' => 'required_with:key_transports|string',
            'key_transports.*.distance' => 'required_with:key_transports|string',
            'booking_form_background_image' => 'nullable|image|max:2048',
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
            if ($property->main_image) $this->fileUploadService->deleteFile($property->main_image);

            // Upload new file via service (includes WebP conversion)
            $validated['main_image'] = $this->fileUploadService->uploadFile(
                $request->file('main_image'),
                'uploads/properties/main'
            );
        }

        if ($request->hasFile('demo_video')) {
            // Delete old video
            if ($property->demo_video) $this->fileUploadService->deleteFile($property->demo_video);

            // Upload new video via service
            $validated['demo_video'] = $this->fileUploadService->uploadFile(
                $request->file('demo_video'),
                'uploads/properties/videos'
            );
        }

        if ($request->hasFile('booking_form_background_image')) {
            // Delete old booking form background image
            if ($property->booking_form_background_image) $this->fileUploadService->deleteFile($property->booking_form_background_image);

            // Upload new booking form background image
            $validated['booking_form_background_image'] = $this->fileUploadService->uploadFile(
                $request->file('booking_form_background_image'),
                'uploads/properties/booking'
            );
        }

        // 6. 🚨 Update: Handle multiple file uploads (NOTE: This implementation ADDS images, it doesn't replace the whole list.)
        if ($request->hasFile('layout_images')) {
            $newLayoutPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('layout_images'),
                'uploads/properties/layouts'
            );

            // Merge new paths with existing ones
            // Since the model casts layout_images as 'array', it's already an array, not JSON
            $existingLayouts = is_array($property->layout_images) 
                ? $property->layout_images 
                : (is_string($property->layout_images) ? json_decode($property->layout_images, true) ?? [] : []);
            $validated['layout_images'] = array_merge($existingLayouts, $newLayoutPaths);
        }

        if ($request->hasFile('gallery_images')) {
            $newGalleryPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('gallery_images'),
                'uploads/properties/gallery'
            );

            // Since the model casts gallery_images as 'array', it's already an array, not JSON
            $existingGallery = is_array($property->gallery_images) 
                ? $property->gallery_images 
                : (is_string($property->gallery_images) ? json_decode($property->gallery_images, true) ?? [] : []);
            $validated['gallery_images'] = array_merge($existingGallery, $newGalleryPaths);
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
        if ($property->main_image) $this->fileUploadService->deleteFile($property->main_image);
        if ($property->demo_video) $this->fileUploadService->deleteFile($property->demo_video);
        if ($property->booking_form_background_image) $this->fileUploadService->deleteFile($property->booking_form_background_image);

        // 7. 🚨 Delete: Handle array/multiple images
        // Since the model casts these as 'array', they're already arrays
        $layoutImages = is_array($property->layout_images) 
            ? $property->layout_images 
            : (is_string($property->layout_images) ? json_decode($property->layout_images, true) ?? [] : []);
        foreach ($layoutImages as $path) {
            if ($path) $this->fileUploadService->deleteFile($path);
        }

        $galleryImages = is_array($property->gallery_images) 
            ? $property->gallery_images 
            : (is_string($property->gallery_images) ? json_decode($property->gallery_images, true) ?? [] : []);
        foreach ($galleryImages as $path) {
            if ($path) $this->fileUploadService->deleteFile($path);
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully'], 200);
    }
}
