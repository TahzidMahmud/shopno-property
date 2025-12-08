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
        Schema::create('header_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('header_navigation_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('type')->default('link'); // 'link' or 'dropdown'
            $table->timestamps();
        });

        Schema::create('header_dropdown_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('navigation_link_id')->constrained('header_navigation_links')->onDelete('cascade');
            $table->string('label');
            $table->string('url');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('header_dropdown_items');
        Schema::dropIfExists('header_navigation_links');
        Schema::dropIfExists('header_settings');
    }
};
