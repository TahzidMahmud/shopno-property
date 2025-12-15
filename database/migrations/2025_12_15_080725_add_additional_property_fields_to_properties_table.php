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
            $table->string('property_category')->nullable()->after('type');
            $table->string('land')->nullable()->after('total_parking');
            $table->string('building_height')->nullable()->after('land');
            $table->date('hand_over_date')->nullable()->after('building_height');
            $table->string('face')->nullable()->after('hand_over_date');
            $table->string('road')->nullable()->after('face');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['property_category', 'land', 'building_height', 'hand_over_date', 'face', 'road']);
        });
    }
};
