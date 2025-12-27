<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the unique index on email
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']);
        });

        // Make email nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
        });

        // Re-add unique constraint (allows multiple NULLs in MySQL)
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the unique index
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']);
        });

        // Make email not nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
        });

        // Re-add unique constraint
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });
    }
};
