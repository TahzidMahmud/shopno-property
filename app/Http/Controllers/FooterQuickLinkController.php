<?php

namespace App\Http\Controllers;

use App\Models\FooterQuickLink;
use Illuminate\Http\Request;

class FooterQuickLinkController extends Controller
{
    public function index()
    {
        $links = FooterQuickLink::orderBy('order')->get();
        return response()->json($links, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $link = FooterQuickLink::create($validated);
        return response()->json(['message' => 'Quick link created successfully', 'data' => $link], 201);
    }

    public function show($id)
    {
        $link = FooterQuickLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Quick link not found'], 404);
        }
        return response()->json($link, 200);
    }

    public function update(Request $request, $id)
    {
        $link = FooterQuickLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Quick link not found'], 404);
        }

        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $link->update($validated);
        return response()->json(['message' => 'Quick link updated successfully', 'data' => $link], 200);
    }

    public function destroy($id)
    {
        $link = FooterQuickLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Quick link not found'], 404);
        }

        $link->delete();
        return response()->json(['message' => 'Quick link deleted successfully'], 200);
    }
}
