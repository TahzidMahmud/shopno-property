<?php

namespace App\Http\Controllers;

use App\Models\HeaderNavigationLink;
use Illuminate\Http\Request;

class HeaderNavigationLinkController extends Controller
{
    public function index()
    {
        $links = HeaderNavigationLink::with('dropdownItems')->orderBy('order')->get();
        return response()->json($links, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'type' => 'required|in:link,dropdown',
        ]);

        $link = HeaderNavigationLink::create($validated);
        return response()->json(['message' => 'Navigation link created successfully', 'data' => $link], 201);
    }

    public function show($id)
    {
        $link = HeaderNavigationLink::with('dropdownItems')->find($id);
        if (!$link) {
            return response()->json(['message' => 'Navigation link not found'], 404);
        }
        return response()->json($link, 200);
    }

    public function update(Request $request, $id)
    {
        $link = HeaderNavigationLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Navigation link not found'], 404);
        }

        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'type' => 'sometimes|required|in:link,dropdown',
        ]);

        $link->update($validated);
        return response()->json(['message' => 'Navigation link updated successfully', 'data' => $link], 200);
    }

    public function destroy($id)
    {
        $link = HeaderNavigationLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Navigation link not found'], 404);
        }

        $link->delete();
        return response()->json(['message' => 'Navigation link deleted successfully'], 200);
    }
}
