<?php

namespace App\Http\Controllers;

use App\Models\HomePageSetting;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\Storage;

class HomePageSettingController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $settings = HomePageSetting::all()->pluck('value', 'key');
        return response()->json($settings, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:home_page_settings,key',
            'value' => 'nullable|string',
            'file' => 'nullable|image|max:2048',
        ]);

        // Handle file upload if provided
        if ($request->hasFile('file')) {
            $validated['value'] = $this->fileUploadService->uploadFile(
                $request->file('file'),
                'uploads/home/settings'
            );
        }

        $setting = HomePageSetting::create($validated);
        return response()->json(['message' => 'Setting created successfully', 'data' => $setting], 201);
    }

    public function show(string $key)
    {
        $setting = HomePageSetting::where('key', $key)->firstOrFail();
        return response()->json($setting, 200);
    }

    public function update(Request $request, string $key)
    {
        $setting = HomePageSetting::where('key', $key)->firstOrFail();

        $validated = $request->validate([
            'value' => 'nullable|string',
            'file' => 'nullable|image|max:2048',
        ]);

        // Handle file upload if provided
        if ($request->hasFile('file')) {
            // Delete old file if it exists
            if ($setting->value) {
                $this->fileUploadService->deleteFile($setting->value);
            }
            $validated['value'] = $this->fileUploadService->uploadFile(
                $request->file('file'),
                'uploads/home/settings'
            );
        }

        $setting->update($validated);
        return response()->json(['message' => 'Setting updated successfully', 'data' => $setting], 200);
    }

    public function destroy(string $key)
    {
        $setting = HomePageSetting::where('key', $key)->firstOrFail();
        
        // Delete associated file if it exists
        if ($setting->value) {
            $this->fileUploadService->deleteFile($setting->value);
        }
        
        $setting->delete();
        return response()->json(['message' => 'Setting deleted successfully'], 200);
    }
}
