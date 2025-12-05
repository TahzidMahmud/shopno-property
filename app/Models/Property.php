<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'status',
        'area',
        'location',
        'type',
        'total_floor',
        'total_flat',
        'flat_size',
        'total_parking',
        'price_range',
        'main_image',
        'layout_images',
        'gallery_images',
        'demo_video',
        'full_address',
        'key_transports',
        'under_development',
        'bedrooms',
        'bathrooms',
        'company_name',
    ];

    protected $casts = [
        'layout_images' => 'array',
        'gallery_images' => 'array',
        'key_transports' => 'array',
    ];

    /**
     * The facilities that belong to the property.
     */
    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'property_facility');
    }
}
