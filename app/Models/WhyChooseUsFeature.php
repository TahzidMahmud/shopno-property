<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhyChooseUsFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'icon_name',
        'title',
        'description',
        'video_url',
        'video_thumbnail',
        'is_active',
        'order',
    ];
}
