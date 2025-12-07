<?php

namespace App\Http\Controllers;

use App\Models\WhyChooseUsFeature;
use Illuminate\Http\Request;

class WhyChooseUsFeatureController extends Controller
{
    public function index()
    {
        $features = WhyChooseUsFeature::orderBy('order')->get();
        return response()->json($features, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $validated['order'] = $validated['order'] ?? WhyChooseUsFeature::max('order') + 1;
        $validated['is_active'] = $validated['is_active'] ?? false;

        $feature = WhyChooseUsFeature::create($validated);
        return response()->json(['message' => 'Feature created successfully', 'data' => $feature], 201);
    }

    public function show(string $id)
    {
        $feature = WhyChooseUsFeature::findOrFail($id);
        return response()->json($feature, 200);
    }

    public function update(Request $request, string $id)
    {
        $feature = WhyChooseUsFeature::findOrFail($id);

        $validated = $request->validate([
            'icon_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $feature->update($validated);
        return response()->json(['message' => 'Feature updated successfully', 'data' => $feature], 200);
    }

    public function destroy(string $id)
    {
        $feature = WhyChooseUsFeature::findOrFail($id);
        $feature->delete();
        return response()->json(['message' => 'Feature deleted successfully'], 200);
    }
}
