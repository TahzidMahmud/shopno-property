<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPageTestimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote',
        'author_name',
        'author_position',
        'author_company',
        'rating',
        'image',
        'order',
        'is_active',
    ];
}
