<?php

namespace App\Http\Controllers;

use App\Models\PropertyQuery;
use Illuminate\Http\Request;

class PropertyQueryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $queries = PropertyQuery::with('property')->orderBy('created_at', 'desc')->get();
        return response()->json($queries, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'query' => 'required|string',
        ]);

        $query = PropertyQuery::create($validated);

        return response()->json([
            'message' => 'Property query submitted successfully',
            'data' => $query->load('property')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $query = PropertyQuery::with('property')->findOrFail($id);
        return response()->json($query, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $query = PropertyQuery::findOrFail($id);
        $query->delete();
        return response()->json(['message' => 'Property query deleted successfully'], 200);
    }
}
