<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'image'
    ];

    /**
     * The properties that belong to the facility.
     */
    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_facility');
    }
}
