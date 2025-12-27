<?php

namespace App\Http\Controllers;

use App\Models\PropertyListing;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\Validator;

class PropertyListingController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listings = PropertyListing::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($listings, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_name' => 'required|string|max:255',
            'property_type' => 'nullable|string|max:255',
            'property_status' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'size' => 'nullable|string|max:255',
            'images.*' => 'nullable|image|max:2048',
            'brochure' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            'handover_date' => 'nullable|date',
            'price' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle multiple images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            $imagePaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('images'),
                'uploads/property-listings/images'
            );
        }
        $data['images'] = !empty($imagePaths) ? $imagePaths : null;

        // Handle brochure file
        if ($request->hasFile('brochure')) {
            $data['brochure'] = $this->fileUploadService->uploadFile(
                $request->file('brochure'),
                'uploads/property-listings/brochures'
            );
        }

        // Set user_id if authenticated
        if (auth()->check()) {
            $data['user_id'] = auth()->id();
        }

        // Set default status
        $data['status'] = 'pending';

        $listing = PropertyListing::create($data);

        return response()->json([
            'message' => 'Property listing submitted successfully',
            'data' => $listing->load('user')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $listing = PropertyListing::with('user')->findOrFail($id);
        return response()->json($listing, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $listing = PropertyListing::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'property_name' => 'sometimes|required|string|max:255',
            'property_type' => 'nullable|string|max:255',
            'property_status' => 'nullable|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'size' => 'nullable|string|max:255',
            'images.*' => 'nullable|image|max:2048',
            'brochure' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'handover_date' => 'nullable|date',
            'price' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle new images (append to existing or replace)
        if ($request->hasFile('images')) {
            $newImagePaths = $this->fileUploadService->uploadMultipleFiles(
                $request->file('images'),
                'uploads/property-listings/images'
            );
            
            // Merge with existing images or replace
            $existingImages = $listing->images ?? [];
            $data['images'] = array_merge($existingImages, $newImagePaths);
        }

        // Handle brochure update
        if ($request->hasFile('brochure')) {
            // Delete old brochure if exists
            if ($listing->brochure) {
                $this->fileUploadService->deleteFile($listing->brochure);
            }
            
            $data['brochure'] = $this->fileUploadService->uploadFile(
                $request->file('brochure'),
                'uploads/property-listings/brochures'
            );
        }

        $listing->update($data);

        return response()->json([
            'message' => 'Property listing updated successfully',
            'data' => $listing->load('user')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $listing = PropertyListing::findOrFail($id);

        // Delete associated files
        if ($listing->images) {
            foreach ($listing->images as $imagePath) {
                $this->fileUploadService->deleteFile($imagePath);
            }
        }

        if ($listing->brochure) {
            $this->fileUploadService->deleteFile($listing->brochure);
        }

        $listing->delete();

        return response()->json([
            'message' => 'Property listing deleted successfully'
        ], 200);
    }

    /**
     * Update listing status (approve/reject)
     */
    public function updateStatus(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $listing = PropertyListing::findOrFail($id);
        $listing->status = $request->status;
        $listing->save();

        return response()->json([
            'message' => 'Listing status updated successfully',
            'data' => $listing->load('user')
        ], 200);
    }
}
