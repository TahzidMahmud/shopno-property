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
        return response()->json(Property::with(['facilities', 'company'])->orderBy('created_at', 'desc')->get(), 200);
    }

    // 🟢 Create a new property
    public function store(Request $request)
    {
        // Validation remains the same, but the max size rules are now enforced here.
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
            'area' => 'nullable|string',
            'location' => 'nullable|string',
            'type' => 'nullable|string',
            'property_category' => 'nullable|string|max:255',
            'total_floor' => 'nullable|integer',
            'total_flat' => 'nullable|integer',
            'flat_size' => 'nullable|integer',
            'total_parking' => 'nullable|integer',
            'land' => 'nullable|string|max:255',
            'building_height' => 'nullable|string|max:255',
            'hand_over_date' => 'nullable|date',
            'face' => 'nullable|string|max:255',
            'road' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'main_image' => 'nullable|image|max:2048',
            'layout_images.*' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
            'featured_images.*' => 'nullable|image|max:2048',
            'demo_video' => 'nullable|string|url|max:500',
            'demo_video_thumbnail' => 'nullable|image|max:2048',
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
            'company_id' => 'nullable|exists:companies,id',
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

        // Handle featured images - check if files exist in the array
        $featuredFiles = $request->file('featured_images');
        if ($featuredFiles && is_array($featuredFiles) && count(array_filter($featuredFiles, function($file) { return $file !== null; })) > 0) {
            $validated['featured_images'] = $this->fileUploadService->uploadMultipleFiles(
                array_filter($featuredFiles, function($file) { return $file !== null; }),
                'uploads/properties/featured'
            );
        }

        // 4. Handle demo_video as YouTube URL (string)
        // demo_video is now a string field, validated above

        // Handle demo_video_thumbnail image upload
        if ($request->hasFile('demo_video_thumbnail')) {
            $validated['demo_video_thumbnail'] = $this->fileUploadService->uploadFile(
                $request->file('demo_video_thumbnail'),
                'uploads/properties/video-thumbnails'
            );
        }

        // Handle brochure PDF upload
        if ($request->hasFile('brochure')) {
            $validated['brochure'] = $this->fileUploadService->uploadFile(
                $request->file('brochure'),
                'uploads/properties/brochures'
            );
        }

        // Handle payment schedule PDF upload
        if ($request->hasFile('payment_schedule')) {
            $validated['payment_schedule'] = $this->fileUploadService->uploadFile(
                $request->file('payment_schedule'),
                'uploads/properties/payment-schedules'
            );
        }

        // Handle booking form background image
        if ($request->hasFile('booking_form_background_image')) {
            $validated['booking_form_background_image'] = $this->fileUploadService->uploadFile(
                $request->file('booking_form_background_image'),
                'uploads/properties/booking'
            );
        }

        // Handle booking form image (left column)
        if ($request->hasFile('booking_form_image')) {
            $validated['booking_form_image'] = $this->fileUploadService->uploadFile(
                $request->file('booking_form_image'),
                'uploads/properties/booking-form'
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
        $property = Property::with(['facilities', 'company'])->find($id);
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
            'description' => 'nullable|string',
            'status' => 'nullable|string',
            'area' => 'nullable|string',
            'location' => 'nullable|string',
            'type' => 'nullable|string',
            'property_category' => 'nullable|string|max:255',
            'total_floor' => 'nullable|integer',
            'total_flat' => 'nullable|integer',
            'flat_size' => 'nullable|integer',
            'total_parking' => 'nullable|integer',
            'land' => 'nullable|string|max:255',
            'building_height' => 'nullable|string|max:255',
            'hand_over_date' => 'nullable|date',
            'face' => 'nullable|string|max:255',
            'road' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'main_image' => 'nullable|image|max:2048',
            'layout_images.*' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
            'featured_images.*' => 'nullable|image|max:2048',
            'demo_video' => 'nullable|string|url|max:500',
            'demo_video_thumbnail' => 'nullable|image|max:2048',
            'brochure' => 'nullable|file|mimes:pdf|max:10240',
            'payment_schedule' => 'nullable|file|mimes:pdf|max:10240',
            'full_address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'key_transports' => 'nullable|array',
            'key_transports.*.name' => 'required_with:key_transports|string',
            'key_transports.*.icon' => 'required_with:key_transports|string',
            'key_transports.*.distance' => 'required_with:key_transports|string',
            'booking_form_background_image' => 'nullable|image|max:2048',
            'booking_form_image' => 'nullable|image|max:2048',
            'under_development' => 'nullable|string',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'company_id' => 'nullable|exists:companies,id',
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

        // Handle demo_video as YouTube URL (string) - no file upload needed
        // If demo_video is provided in request, it will be validated and updated

        // Handle demo_video_thumbnail image upload
        if ($request->hasFile('demo_video_thumbnail')) {
            // Delete old thumbnail
            if ($property->demo_video_thumbnail) {
                $this->fileUploadService->deleteFile($property->demo_video_thumbnail);
            }
            // Upload new thumbnail
            $validated['demo_video_thumbnail'] = $this->fileUploadService->uploadFile(
                $request->file('demo_video_thumbnail'),
                'uploads/properties/video-thumbnails'
            );
        }

        // Handle brochure PDF upload
        if ($request->hasFile('brochure')) {
            // Delete old brochure
            if ($property->brochure) {
                $this->fileUploadService->deleteFile($property->brochure);
            }
            // Upload new brochure
            $validated['brochure'] = $this->fileUploadService->uploadFile(
                $request->file('brochure'),
                'uploads/properties/brochures'
            );
        }

        // Handle payment schedule PDF upload
        if ($request->hasFile('payment_schedule')) {
            // Delete old payment schedule
            if ($property->payment_schedule) {
                $this->fileUploadService->deleteFile($property->payment_schedule);
            }
            // Upload new payment schedule
            $validated['payment_schedule'] = $this->fileUploadService->uploadFile(
                $request->file('payment_schedule'),
                'uploads/properties/payment-schedules'
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

        // Handle booking form image (left column)
        if ($request->hasFile('booking_form_image')) {
            // Delete old booking form image
            if ($property->booking_form_image) {
                $this->fileUploadService->deleteFile($property->booking_form_image);
            }
            // Upload new booking form image
            $validated['booking_form_image'] = $this->fileUploadService->uploadFile(
                $request->file('booking_form_image'),
                'uploads/properties/booking-form'
            );
        }

        // 6. 🚨 Update: Handle multiple file uploads and image removal
        // Get existing images from database
        $existingLayouts = is_array($property->layout_images)
            ? $property->layout_images
            : (is_string($property->layout_images) ? json_decode($property->layout_images, true) ?? [] : []);
        $existingGallery = is_array($property->gallery_images)
            ? $property->gallery_images
            : (is_string($property->gallery_images) ? json_decode($property->gallery_images, true) ?? [] : []);
        $existingFeatured = is_array($property->featured_images)
            ? $property->featured_images
            : (is_string($property->featured_images) ? json_decode($property->featured_images, true) ?? [] : []);

        // Get images to keep from request (if provided, ensure it's an array)
        $keptLayoutImages = $request->input('existing_layout_images', []);
        $keptGalleryImages = $request->input('existing_gallery_images', []);
        $keptFeaturedImages = $request->input('existing_featured_images', []);

        // Ensure arrays (handle case where single value is sent)
        if (!is_array($keptLayoutImages)) {
            $keptLayoutImages = $keptLayoutImages ? [$keptLayoutImages] : [];
        }
        if (!is_array($keptGalleryImages)) {
            $keptGalleryImages = $keptGalleryImages ? [$keptGalleryImages] : [];
        }
        if (!is_array($keptFeaturedImages)) {
            $keptFeaturedImages = $keptFeaturedImages ? [$keptFeaturedImages] : [];
        }

        // Find images to delete (existing images not in kept list)
        $layoutImagesToDelete = array_diff($existingLayouts, $keptLayoutImages);
        $galleryImagesToDelete = array_diff($existingGallery, $keptGalleryImages);
        $featuredImagesToDelete = array_diff($existingFeatured, $keptFeaturedImages);

        // Delete removed images from filesystem
        foreach ($layoutImagesToDelete as $imagePath) {
            if (!empty($imagePath)) {
                $this->fileUploadService->deleteFile($imagePath);
            }
        }
        foreach ($galleryImagesToDelete as $imagePath) {
            if (!empty($imagePath)) {
                $this->fileUploadService->deleteFile($imagePath);
            }
        }
        foreach ($featuredImagesToDelete as $imagePath) {
            if (!empty($imagePath)) {
                $this->fileUploadService->deleteFile($imagePath);
            }
        }

        // Handle new file uploads
        $newLayoutPaths = [];
        if ($request->hasFile('layout_images')) {
            $newLayoutPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('layout_images'),
                'uploads/properties/layouts'
            );
        }

        $newGalleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            $newGalleryPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('gallery_images'),
                'uploads/properties/gallery'
            );
        }

        $newFeaturedPaths = [];
        if ($request->hasFile('featured_images')) {
            $newFeaturedPaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('featured_images'),
                'uploads/properties/featured'
            );
        }

        // Combine kept images with new images (only update if there are changes or new uploads)
        if ($request->has('existing_layout_images') || $request->hasFile('layout_images')) {
            $validated['layout_images'] = array_merge($keptLayoutImages, $newLayoutPaths);
        }
        if ($request->has('existing_gallery_images') || $request->hasFile('gallery_images')) {
            $validated['gallery_images'] = array_merge($keptGalleryImages, $newGalleryPaths);
        }
        if ($request->has('existing_featured_images') || $request->hasFile('featured_images')) {
            $validated['featured_images'] = array_merge($keptFeaturedImages, $newFeaturedPaths);
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
        // demo_video is now a YouTube URL string, no file to delete
        if ($property->demo_video_thumbnail) $this->fileUploadService->deleteFile($property->demo_video_thumbnail);
        if ($property->brochure) $this->fileUploadService->deleteFile($property->brochure);
        if ($property->payment_schedule) $this->fileUploadService->deleteFile($property->payment_schedule);
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
