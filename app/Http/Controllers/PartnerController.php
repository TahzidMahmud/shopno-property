<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $partners = Partner::orderBy('order')->get();
        return response()->json($partners, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'required|image|max:2048',
            'website' => 'nullable|url|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $this->fileUploadService->uploadFile(
                $request->file('logo'),
                'uploads/home/partners'
            );
        }

        $validated['order'] = $validated['order'] ?? Partner::max('order') + 1;
        // Convert string boolean to actual boolean
        $validated['is_active'] = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

        $partner = Partner::create($validated);
        return response()->json(['message' => 'Partner created successfully', 'data' => $partner], 201);
    }

    public function show(string $id)
    {
        $partner = Partner::findOrFail($id);
        return response()->json($partner, 200);
    }

    public function update(Request $request, string $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'website' => 'nullable|url|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        if ($request->hasFile('logo')) {
            if ($partner->logo) {
                $this->fileUploadService->deleteFile($partner->logo);
            }
            $validated['logo'] = $this->fileUploadService->uploadFile(
                $request->file('logo'),
                'uploads/home/partners'
            );
        }

        // Convert string boolean to actual boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $partner->update($validated);
        return response()->json(['message' => 'Partner updated successfully', 'data' => $partner], 200);
    }

    public function destroy(string $id)
    {
        $partner = Partner::findOrFail($id);
        
        if ($partner->logo) {
            $this->fileUploadService->deleteFile($partner->logo);
        }
        
        $partner->delete();
        return response()->json(['message' => 'Partner deleted successfully'], 200);
    }
}
