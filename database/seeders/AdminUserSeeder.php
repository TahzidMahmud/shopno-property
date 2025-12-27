<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $admin = User::where('email', 'admin@shopnoproperty.com')->first();

        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin User',
                'email' => 'admin@shopnoproperty.com',
                'password' => Hash::make('admin123'),
            ]);

            $this->command->info('Admin user created successfully!');
        } else {
            $this->command->info('Admin user already exists.');
        }

        // Ensure admin role exists and assign it to the admin user
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
            $this->command->info('Admin role assigned to admin user.');
        } else {
            $this->command->info('Admin user already has admin role.');
        }

        $this->command->info('Email: admin@shopnoproperty.com');
        $this->command->info('Password: admin123');
    }
}
