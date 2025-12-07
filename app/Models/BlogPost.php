<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'image',
        'published_date',
        'slug',
        'is_published',
        'order',
    ];

    protected $casts = [
        'published_date' => 'date',
    ];
}
