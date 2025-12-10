<?php

namespace App\Http\Controllers;

use App\Models\AboutPageTeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\FileUploadService;

class AboutPageTeamMemberController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        $members = AboutPageTeamMember::orderBy('order')->get();
        return response()->json($members, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/about/team'
            );
        } else {
            // Set a default placeholder if no image provided
            $validated['image'] = null;
        }

        $member = AboutPageTeamMember::create($validated);
        return response()->json(['message' => 'Team member created successfully', 'data' => $member], 201);
    }

    public function show($id)
    {
        $member = AboutPageTeamMember::find($id);
        if (!$member) {
            return response()->json(['message' => 'Team member not found'], 404);
        }
        return response()->json($member, 200);
    }

    public function update(Request $request, $id)
    {
        $member = AboutPageTeamMember::find($id);
        if (!$member) {
            return response()->json(['message' => 'Team member not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($member->image) {
                $this->fileUploadService->deleteFile($member->image);
            }
            $validated['image'] = $this->fileUploadService->uploadFile(
                $request->file('image'),
                'uploads/about/team'
            );
        }

        $member->update($validated);
        return response()->json(['message' => 'Team member updated successfully', 'data' => $member], 200);
    }

    public function destroy($id)
    {
        $member = AboutPageTeamMember::find($id);
        if (!$member) {
            return response()->json(['message' => 'Team member not found'], 404);
        }

        if ($member->image) {
            $this->fileUploadService->deleteFile($member->image);
        }

        $member->delete();
        return response()->json(['message' => 'Team member deleted successfully'], 200);
    }
}
