<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Drop the old company_name column
            $table->dropColumn('company_name');
            
            // Add new company_id column
            $table->foreignId('company_id')->nullable()->after('bathrooms')->constrained('companies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Drop foreign key and company_id
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
            
            // Restore company_name
            $table->string('company_name')->nullable()->after('bathrooms');
        });
    }
};
