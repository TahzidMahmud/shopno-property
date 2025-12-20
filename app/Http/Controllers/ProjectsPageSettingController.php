<?php

namespace App\Http\Controllers;

use App\Models\ProjectsPageSetting;
use Illuminate\Http\Request;
use App\Services\FileUploadService;

class ProjectsPageSettingController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $settings = ProjectsPageSetting::all()->pluck('value', 'key');
        return response()->json($settings, 200);
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
                'uploads/projects'
            );
        }

        $setting = ProjectsPageSetting::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value'] ?? '']
        );

        return response()->json(['message' => 'Setting updated successfully', 'data' => $setting], 200);
    }
}
