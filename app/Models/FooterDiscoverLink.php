<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterDiscoverLink extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'url', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
