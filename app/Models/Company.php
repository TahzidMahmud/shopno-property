<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'owner_name',
    ];

    /**
     * Get the properties for the company.
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}
