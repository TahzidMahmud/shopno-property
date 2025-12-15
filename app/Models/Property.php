<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'area',
        'location',
        'type',
        'total_floor',
        'total_flat',
        'flat_size',
        'total_parking',
        'price',
        'main_image',
        'layout_images',
        'gallery_images',
        'featured_images',
        'demo_video',
        'demo_video_thumbnail',
        'brochure',
        'payment_schedule',
        'booking_form_background_image',
        'booking_form_image',
        'full_address',
        'latitude',
        'longitude',
        'key_transports',
        'under_development',
        'bedrooms',
        'bathrooms',
        'company_id',
    ];

    protected $casts = [
        'layout_images' => 'array',
        'gallery_images' => 'array',
        'featured_images' => 'array',
        'key_transports' => 'array',
    ];

    /**
     * The facilities that belong to the property.
     */
    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'property_facility');
    }

    /**
     * Get the company that owns the property.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
