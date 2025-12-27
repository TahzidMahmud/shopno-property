<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of roles
     */
    public function index()
    {
        $roles = Role::with('permissions')->orderBy('name')->get();
        return response()->json($roles, 200);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);

        if (isset($validated['permissions']) && !empty($validated['permissions'])) {
            $role->givePermissionTo($validated['permissions']);
        }

        $role->load('permissions');

        return response()->json([
            'message' => 'Role created successfully',
            'data' => $role
        ], 201);
    }

    /**
     * Display the specified role
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json($role, 200);
    }

    /**
     * Update the specified role
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update(['name' => $validated['name']]);

        // Sync permissions
        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        $role->load('permissions');

        return response()->json([
            'message' => 'Role updated successfully',
            'data' => $role
        ], 200);
    }

    /**
     * Remove the specified role
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        
        // Prevent deleting system roles (optional - you can remove this if you want)
        if (in_array($role->name, ['admin'])) {
            return response()->json([
                'message' => 'Cannot delete system role'
            ], 403);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully'], 200);
    }

    /**
     * Get all permissions (helper method)
     */
    public function getPermissions()
    {
        $permissions = Permission::orderBy('name')->get();
        return response()->json($permissions, 200);
    }
}
