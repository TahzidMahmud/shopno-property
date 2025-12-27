<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for property management
        $permissions = [
            'properties.create',
            'properties.edit',
            'properties.delete',
            'properties.manage', // Full management access
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $propertyManagerRole = Role::firstOrCreate(['name' => 'property-manager', 'guard_name' => 'web']);

        // Assign all permissions to admin
        $adminRole->givePermissionTo($permissions);

        // Assign property management permissions to property-manager
        $propertyManagerRole->givePermissionTo([
            'properties.create',
            'properties.edit',
            'properties.delete',
            'properties.manage',
        ]);
    }
}
