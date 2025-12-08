<?php

namespace App\Http\Controllers;

use App\Models\AboutPageProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\FileUploadService;

class AboutPageProjectController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $projects = AboutPageProject::orderBy('order')->get();
        return response()->json($projects, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/about/projects'
            );
        } else {
            $validated['image'] = null;
        }

        $project = AboutPageProject::create($validated);
        return response()->json(['message' => 'Project created successfully', 'data' => $project], 201);
    }

    public function show($id)
    {
        $project = AboutPageProject::find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        return response()->json($project, 200);
    }

    public function update(Request $request, $id)
    {
        $project = AboutPageProject::find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/about/projects'
            );
        }

        $project->update($validated);
        return response()->json(['message' => 'Project updated successfully', 'data' => $project], 200);
    }

    public function destroy($id)
    {
        $project = AboutPageProject::find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        $project->delete();
        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}
