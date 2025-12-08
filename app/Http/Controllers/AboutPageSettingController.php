<?php

namespace App\Http\Controllers;

use App\Models\AboutPageSetting;
use App\Models\AboutPageProject;
use App\Models\AboutPageTeamMember;
use App\Models\AboutPageTestimonial;
use Illuminate\Http\Request;
use App\Services\FileUploadService;

class AboutPageSettingController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $settings = AboutPageSetting::all()->pluck('value', 'key');
        $projects = AboutPageProject::where('is_active', true)->orderBy('order')->get();
        $teamMembers = AboutPageTeamMember::where('is_active', true)->orderBy('order')->get();
        $testimonials = AboutPageTestimonial::where('is_active', true)->orderBy('order')->get();
        
        return response()->json([
            'settings' => $settings,
            'projects' => $projects,
            'team_members' => $teamMembers,
            'testimonials' => $testimonials,
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
                'uploads/about'
            );
        }

        $setting = AboutPageSetting::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value'] ?? '']
        );

        return response()->json(['message' => 'Setting updated successfully', 'data' => $setting], 200);
    }
}
