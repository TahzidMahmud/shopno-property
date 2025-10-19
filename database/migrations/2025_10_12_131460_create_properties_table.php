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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('status')->nullable();
            $table->string('area')->nullable();
            $table->string('location')->nullable();
            $table->string('type')->nullable();
            $table->integer('total_floor')->nullable();
            $table->integer('total_flat')->nullable();
            $table->integer('flat_size')->nullable();
            $table->integer('total_parking')->nullable();
            $table->string('price_range')->nullable();
            $table->string('main_image')->nullable();
            $table->json('layout_images')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('demo_video')->nullable();
            $table->text('full_address')->nullable();
            $table->json('key_transports')->nullable();
            $table->string('under_development')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->string('company_name')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
