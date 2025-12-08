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
        Schema::create('about_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('about_page_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('about_page_team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->string('image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('about_page_testimonials', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author_name');
            $table->string('author_position');
            $table->string('author_company')->nullable();
            $table->integer('rating')->default(5);
            $table->string('image')->nullable();
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
        Schema::dropIfExists('about_page_testimonials');
        Schema::dropIfExists('about_page_team_members');
        Schema::dropIfExists('about_page_projects');
        Schema::dropIfExists('about_page_settings');
    }
};
