<?php

namespace App\Http\Controllers;

use App\Models\PropertyType;
use Illuminate\Http\Request;

class PropertyTypeController extends Controller
{
    public function index()
    {
        $types = PropertyType::orderBy('order')->get();
        return response()->json($types, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type_value' => 'required|string|max:255',
            'icon_name' => 'nullable|string|max:255',
            'icon_image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        // Handle icon image upload
        if ($request->hasFile('icon_image')) {
            $validated['icon_image'] = $this->fileUploadService->uploadFile(
                $request->file('icon_image'),
                'uploads/property-types'
            );
        }

        $validated['order'] = $validated['order'] ?? PropertyType::max('order') + 1;
        // Convert string boolean to actual boolean
        $validated['is_active'] = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

        $type = PropertyType::create($validated);
        return response()->json(['message' => 'Property type created successfully', 'data' => $type], 201);
    }

    public function show(string $id)
    {
        $type = PropertyType::findOrFail($id);
        return response()->json($type, 200);
    }

    public function update(Request $request, string $id)
    {
        $type = PropertyType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type_value' => 'required|string|max:255',
            'icon_name' => 'nullable|string|max:255',
            'icon_image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        // Handle icon image upload
        if ($request->hasFile('icon_image')) {
            // Delete old icon image if exists
            if ($type->icon_image) {
                $this->fileUploadService->deleteFile($type->icon_image);
            }
            // Upload new icon image
            $validated['icon_image'] = $this->fileUploadService->uploadFile(
                $request->file('icon_image'),
                'uploads/property-types'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $type->update($validated);
        return response()->json(['message' => 'Property type updated successfully', 'data' => $type], 200);
    }

    public function destroy(string $id)
    {
        $type = PropertyType::findOrFail($id);
        
        // Delete icon image if exists
        if ($type->icon_image) {
            $this->fileUploadService->deleteFile($type->icon_image);
        }
        
        $type->delete();
        return response()->json(['message' => 'Property type deleted successfully'], 200);
    }
}
