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
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('footer_quick_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('footer_discover_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('footer_social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // facebook, linkedin, twitter, instagram
            $table->string('url');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_social_links');
        Schema::dropIfExists('footer_discover_links');
        Schema::dropIfExists('footer_quick_links');
        Schema::dropIfExists('footer_settings');
    }
};
