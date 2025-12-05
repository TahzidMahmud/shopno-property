<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\FileUploadService;

class FacilityController extends Controller
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
        return response()->json(Facility::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/facilities'
            );
        }

        $facility = Facility::create($validated);

        return response()->json(['message' => 'Facility created successfully', 'data' => $facility], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $facility = Facility::find($id);
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }
        return response()->json($facility, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $facility = Facility::find($id);
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($facility->image) {
                Storage::disk('public')->delete($facility->image);
            }

            // Upload new image
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/facilities'
            );
        }

        $facility->update($validated);

        return response()->json(['message' => 'Facility updated successfully', 'data' => $facility], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $facility = Facility::find($id);
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        // Delete image file
        if ($facility->image) {
            Storage::disk('public')->delete($facility->image);
        }

        $facility->delete();

        return response()->json(['message' => 'Facility deleted successfully'], 200);
    }
}
