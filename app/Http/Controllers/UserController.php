<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['roles', 'permissions'])->orderBy('created_at', 'desc')->get();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'phone' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'is_banned' => 'nullable|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_banned'] = $validated['is_banned'] ?? false;

        $user = User::create($validated);

        // Remove password from response
        $user->makeHidden(['password']);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);
        $user->makeHidden(['password']);
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'phone' => 'required|string|max:255',
            'password' => 'nullable|string|min:8',
            'is_banned' => 'nullable|boolean',
        ]);

        // Only hash password if it's provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Remove password from response
        $user->makeHidden(['password']);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    /**
     * Ban a user
     */
    public function ban(string $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent banning yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot ban your own account'
            ], 403);
        }

        $user->update(['is_banned' => true]);
        $user->makeHidden(['password']);

        return response()->json([
            'message' => 'User banned successfully',
            'data' => $user
        ], 200);
    }

    /**
     * Unban a user
     */
    public function unban(string $id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_banned' => false]);
        $user->makeHidden(['password']);

        return response()->json([
            'message' => 'User unbanned successfully',
            'data' => $user
        ], 200);
    }
}
