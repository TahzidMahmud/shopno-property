<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    use HasFactory;

    protected $fillable = [
        'background_image',
        'title',
        'subtitle',
        'description',
        'button_text',
        'button_link',
        'order',
        'is_active',
    ];
}
