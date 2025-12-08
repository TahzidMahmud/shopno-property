<?php

namespace App\Http\Controllers;

use App\Models\FooterSocialLink;
use Illuminate\Http\Request;

class FooterSocialLinkController extends Controller
{
    public function index()
    {
        $links = FooterSocialLink::all();
        return response()->json($links, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255|in:facebook,linkedin,twitter,instagram',
            'url' => 'required|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $link = FooterSocialLink::create($validated);
        return response()->json(['message' => 'Social link created successfully', 'data' => $link], 201);
    }

    public function show($id)
    {
        $link = FooterSocialLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Social link not found'], 404);
        }
        return response()->json($link, 200);
    }

    public function update(Request $request, $id)
    {
        $link = FooterSocialLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Social link not found'], 404);
        }

        $validated = $request->validate([
            'platform' => 'sometimes|required|string|max:255|in:facebook,linkedin,twitter,instagram',
            'url' => 'sometimes|required|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $link->update($validated);
        return response()->json(['message' => 'Social link updated successfully', 'data' => $link], 200);
    }

    public function destroy($id)
    {
        $link = FooterSocialLink::find($id);
        if (!$link) {
            return response()->json(['message' => 'Social link not found'], 404);
        }

        $link->delete();
        return response()->json(['message' => 'Social link deleted successfully'], 200);
    }
}
