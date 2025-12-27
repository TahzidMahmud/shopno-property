<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class PermissionController extends Controller
{
    /**
     * Get all permissions
     */
    public function getPermissions()
    {
        $permissions = Permission::orderBy('name')->get();
        return response()->json($permissions, 200);
    }

    /**
     * Get all roles
     */
    public function getRoles()
    {
        $roles = Role::with('permissions')->orderBy('name')->get();
        return response()->json($roles, 200);
    }

    /**
     * Get user permissions and roles
     */
    public function getUserPermissions($userId)
    {
        $user = User::findOrFail($userId);
        
        return response()->json([
            'roles' => $user->roles,
            'permissions' => $user->getAllPermissions(),
            'direct_permissions' => $user->permissions,
        ], 200);
    }

    /**
     * Assign role to user
     */
    public function assignRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $user->assignRole($request->role);

        return response()->json([
            'message' => 'Role assigned successfully',
            'data' => $user->load('roles', 'permissions')
        ], 200);
    }

    /**
     * Remove role from user
     */
    public function removeRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $user->removeRole($request->role);

        return response()->json([
            'message' => 'Role removed successfully',
            'data' => $user->load('roles', 'permissions')
        ], 200);
    }

    /**
     * Assign permission to user
     */
    public function assignPermission(Request $request, $userId)
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $user = User::findOrFail($userId);
        $user->givePermissionTo($request->permission);

        return response()->json([
            'message' => 'Permission assigned successfully',
            'data' => $user->load('roles', 'permissions')
        ], 200);
    }

    /**
     * Remove permission from user
     */
    public function removePermission(Request $request, $userId)
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $user = User::findOrFail($userId);
        $user->revokePermissionTo($request->permission);

        return response()->json([
            'message' => 'Permission removed successfully',
            'data' => $user->load('roles', 'permissions')
        ], 200);
    }

    /**
     * Sync roles for user
     */
    public function syncRoles(Request $request, $userId)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $user->syncRoles($request->roles);

        return response()->json([
            'message' => 'Roles synced successfully',
            'data' => $user->load('roles', 'permissions')
        ], 200);
    }

    /**
     * Sync permissions for user
     */
    public function syncPermissions(Request $request, $userId)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $user = User::findOrFail($userId);
        $user->syncPermissions($request->permissions);

        return response()->json([
            'message' => 'Permissions synced successfully',
            'data' => $user->load('roles', 'permissions')
        ], 200);
    }
}
