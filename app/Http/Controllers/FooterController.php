<?php

namespace App\Http\Controllers;

use App\Models\FooterSetting;
use App\Models\FooterQuickLink;
use App\Models\FooterDiscoverLink;
use App\Models\FooterSocialLink;
use Illuminate\Http\Request;
use App\Services\FileUploadService;

class FooterController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $settings = FooterSetting::all()->pluck('value', 'key');
        $quickLinks = FooterQuickLink::where('is_active', true)->orderBy('order')->get();
        $discoverLinks = FooterDiscoverLink::where('is_active', true)->orderBy('order')->get();
        $socialLinks = FooterSocialLink::where('is_active', true)->get();
        
        return response()->json([
            'settings' => $settings,
            'quick_links' => $quickLinks,
            'discover_links' => $discoverLinks,
            'social_links' => $socialLinks,
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
                'uploads/footer'
            );
        }

        $setting = FooterSetting::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value'] ?? '']
        );

        return response()->json(['message' => 'Setting updated successfully', 'data' => $setting], 200);
    }
}
