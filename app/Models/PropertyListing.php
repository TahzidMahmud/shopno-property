<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_name',
        'property_type',
        'property_status',
        'location',
        'size',
        'images',
        'brochure',
        'handover_date',
        'price',
        'user_id',
        'status',
    ];

    protected $casts = [
        'images' => 'array',
        'handover_date' => 'date',
        'price' => 'decimal:2',
    ];

    /**
     * Get the user who submitted the listing.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
