<?php

namespace App\Http\Controllers;

use App\Models\ContactPageSetting;
use App\Models\ContactPageKeyTransport;
use Illuminate\Http\Request;
use App\Services\FileUploadService;

class ContactPageSettingController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $settings = ContactPageSetting::all()->pluck('value', 'key');
        $keyTransports = ContactPageKeyTransport::where('is_active', true)
            ->orderBy('order')
            ->get();
        
        return response()->json([
            'settings' => $settings,
            'key_transports' => $keyTransports,
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
                'uploads/contact'
            );
        }

        $setting = ContactPageSetting::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value'] ?? '']
        );

        return response()->json(['message' => 'Setting updated successfully', 'data' => $setting], 200);
    }
}
