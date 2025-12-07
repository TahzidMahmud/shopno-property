<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'label',
        'value',
        'order',
        'is_active',
    ];
}
