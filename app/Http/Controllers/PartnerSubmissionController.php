<?php

namespace App\Http\Controllers;

use App\Models\PartnerSubmission;
use Illuminate\Http\Request;

class PartnerSubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submissions = PartnerSubmission::orderBy('created_at', 'desc')->get();
        return response()->json($submissions, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'project_details' => 'required|string',
        ]);

        $submission = PartnerSubmission::create($validated);

        return response()->json([
            'message' => 'Partner submission received successfully',
            'data' => $submission
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $submission = PartnerSubmission::findOrFail($id);
        return response()->json($submission, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $submission = PartnerSubmission::findOrFail($id);
        $submission->delete();
        return response()->json(['message' => 'Partner submission deleted successfully'], 200);
    }
}
