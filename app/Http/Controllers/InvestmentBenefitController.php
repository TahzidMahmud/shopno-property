<?php

namespace App\Http\Controllers;

use App\Models\InvestmentBenefit;
use Illuminate\Http\Request;

class InvestmentBenefitController extends Controller
{
    public function index()
    {
        $benefits = InvestmentBenefit::orderBy('order')->get();
        return response()->json($benefits, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $validated['order'] = $validated['order'] ?? InvestmentBenefit::max('order') + 1;

        $benefit = InvestmentBenefit::create($validated);
        return response()->json(['message' => 'Investment benefit created successfully', 'data' => $benefit], 201);
    }

    public function show(string $id)
    {
        $benefit = InvestmentBenefit::findOrFail($id);
        return response()->json($benefit, 200);
    }

    public function update(Request $request, string $id)
    {
        $benefit = InvestmentBenefit::findOrFail($id);

        $validated = $request->validate([
            'icon_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $benefit->update($validated);
        return response()->json(['message' => 'Investment benefit updated successfully', 'data' => $benefit], 200);
    }

    public function destroy(string $id)
    {
        $benefit = InvestmentBenefit::findOrFail($id);
        $benefit->delete();
        return response()->json(['message' => 'Investment benefit deleted successfully'], 200);
    }
}
