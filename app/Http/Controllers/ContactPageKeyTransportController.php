<?php

namespace App\Http\Controllers;

use App\Models\ContactPageKeyTransport;
use Illuminate\Http\Request;

class ContactPageKeyTransportController extends Controller
{
    public function index()
    {
        $transports = ContactPageKeyTransport::orderBy('order')->get();
        return response()->json($transports, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
            'distance' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $transport = ContactPageKeyTransport::create($validated);
        return response()->json(['message' => 'Key transport created successfully', 'data' => $transport], 201);
    }

    public function show($id)
    {
        $transport = ContactPageKeyTransport::find($id);
        if (!$transport) {
            return response()->json(['message' => 'Key transport not found'], 404);
        }
        return response()->json($transport, 200);
    }

    public function update(Request $request, $id)
    {
        $transport = ContactPageKeyTransport::find($id);
        if (!$transport) {
            return response()->json(['message' => 'Key transport not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string|max:255',
            'distance' => 'sometimes|required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $transport->update($validated);
        return response()->json(['message' => 'Key transport updated successfully', 'data' => $transport], 200);
    }

    public function destroy($id)
    {
        $transport = ContactPageKeyTransport::find($id);
        if (!$transport) {
            return response()->json(['message' => 'Key transport not found'], 404);
        }

        $transport->delete();
        return response()->json(['message' => 'Key transport deleted successfully'], 200);
    }
}
