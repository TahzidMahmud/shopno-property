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
            // Drop the old price_range column
            $table->dropColumn('price_range');
            
            // Add new price column (decimal for precise currency values)
            $table->decimal('price', 15, 2)->nullable()->after('total_parking');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Drop price column
            $table->dropColumn('price');
            
            // Restore price_range
            $table->string('price_range')->nullable()->after('total_parking');
        });
    }
};
