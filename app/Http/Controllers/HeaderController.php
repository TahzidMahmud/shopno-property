<?php

namespace App\Http\Controllers;

use App\Models\HeaderSetting;
use App\Models\HeaderNavigationLink;
use Illuminate\Http\Request;
use App\Services\FileUploadService;

class HeaderController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $settings = HeaderSetting::all()->pluck('value', 'key');
        $navigationLinks = HeaderNavigationLink::with('dropdownItems')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();
        
        return response()->json([
            'settings' => $settings,
            'navigation_links' => $navigationLinks,
        ], 200);
    }

    public function updateSetting(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
            'file' => 'nullable|image|max:2048',
        ]);

        // Handle file upload if provided
        if ($request->hasFile('file')) {
            $validated['value'] = $this->fileUploadService->uploadFile(
                $request->file('file'),
                'uploads/header'
            );
        }

        $setting = HeaderSetting::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value'] ?? '']
        );

        return response()->json(['message' => 'Setting updated successfully', 'data' => $setting], 200);
    }
}
