<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPageTeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'image',
        'order',
        'is_active',
    ];
}
