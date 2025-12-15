<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyQuery extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'full_name',
        'phone_number',
        'email',
        'query',
    ];

    /**
     * Get the property that owns the query.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
