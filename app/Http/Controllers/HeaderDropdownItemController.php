<?php

namespace App\Http\Controllers;

use App\Models\HeaderDropdownItem;
use Illuminate\Http\Request;

class HeaderDropdownItemController extends Controller
{
    public function index($navigationLinkId)
    {
        $items = HeaderDropdownItem::where('navigation_link_id', $navigationLinkId)
            ->orderBy('order')
            ->get();
        return response()->json($items, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'navigation_link_id' => 'required|exists:header_navigation_links,id',
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $item = HeaderDropdownItem::create($validated);
        return response()->json(['message' => 'Dropdown item created successfully', 'data' => $item], 201);
    }

    public function show($id)
    {
        $item = HeaderDropdownItem::find($id);
        if (!$item) {
            return response()->json(['message' => 'Dropdown item not found'], 404);
        }
        return response()->json($item, 200);
    }

    public function update(Request $request, $id)
    {
        $item = HeaderDropdownItem::find($id);
        if (!$item) {
            return response()->json(['message' => 'Dropdown item not found'], 404);
        }

        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $item->update($validated);
        return response()->json(['message' => 'Dropdown item updated successfully', 'data' => $item], 200);
    }

    public function destroy($id)
    {
        $item = HeaderDropdownItem::find($id);
        if (!$item) {
            return response()->json(['message' => 'Dropdown item not found'], 404);
        }

        $item->delete();
        return response()->json(['message' => 'Dropdown item deleted successfully'], 200);
    }
}
