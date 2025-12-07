<?php

namespace App\Http\Controllers;

use App\Models\SearchOption;
use Illuminate\Http\Request;

class SearchOptionController extends Controller
{
    public function index(Request $request)
    {
        $query = SearchOption::query();
        
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        $options = $query->orderBy('order')->get();
        return response()->json($options, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['order'] = $validated['order'] ?? SearchOption::where('category', $validated['category'])->max('order') + 1;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $option = SearchOption::create($validated);
        return response()->json(['message' => 'Search option created successfully', 'data' => $option], 201);
    }

    public function show(string $id)
    {
        $option = SearchOption::findOrFail($id);
        return response()->json($option, 200);
    }

    public function update(Request $request, string $id)
    {
        $option = SearchOption::findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $option->update($validated);
        return response()->json(['message' => 'Search option updated successfully', 'data' => $option], 200);
    }

    public function destroy(string $id)
    {
        $option = SearchOption::findOrFail($id);
        $option->delete();
        return response()->json(['message' => 'Search option deleted successfully'], 200);
    }
}
