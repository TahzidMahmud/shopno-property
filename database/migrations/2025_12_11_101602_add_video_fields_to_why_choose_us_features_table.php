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
        Schema::table('why_choose_us_features', function (Blueprint $table) {
            $table->string('video_url')->nullable()->after('description');
            $table->string('video_thumbnail')->nullable()->after('video_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('why_choose_us_features', function (Blueprint $table) {
            $table->dropColumn(['video_url', 'video_thumbnail']);
        });
    }
};
