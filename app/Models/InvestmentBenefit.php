<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestmentBenefit extends Model
{
    use HasFactory;

    protected $fillable = [
        'icon_name',
        'title',
        'description',
        'order',
    ];
}
