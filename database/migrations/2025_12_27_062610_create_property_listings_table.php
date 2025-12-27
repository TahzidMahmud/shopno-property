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
        Schema::create('property_listings', function (Blueprint $table) {
            $table->id();
            $table->string('property_name');
            $table->string('property_type')->nullable();
            $table->string('property_status')->nullable();
            $table->string('location');
            $table->string('size')->nullable();
            $table->json('images')->nullable(); // Multiple images stored as JSON array
            $table->string('brochure')->nullable(); // Optional brochure file
            $table->date('handover_date')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->unsignedBigInteger('user_id')->nullable(); // User who submitted the listing
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_listings');
    }
};
