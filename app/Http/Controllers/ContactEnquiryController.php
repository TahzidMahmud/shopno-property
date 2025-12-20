<?php

namespace App\Http\Controllers;

use App\Models\ContactEnquiry;
use Illuminate\Http\Request;

class ContactEnquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $enquiries = ContactEnquiry::orderBy('created_at', 'desc')->get();
        return response()->json($enquiries, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'project' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        $enquiry = ContactEnquiry::create($validated);

        return response()->json([
            'message' => 'Contact enquiry submitted successfully',
            'data' => $enquiry
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $enquiry = ContactEnquiry::findOrFail($id);
        return response()->json($enquiry, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $enquiry = ContactEnquiry::findOrFail($id);
        $enquiry->delete();
        return response()->json(['message' => 'Contact enquiry deleted successfully'], 200);
    }
}
