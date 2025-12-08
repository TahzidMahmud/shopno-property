<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeaderDropdownItem extends Model
{
    use HasFactory;

    protected $fillable = ['navigation_link_id', 'label', 'url', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function navigationLink()
    {
        return $this->belongsTo(HeaderNavigationLink::class, 'navigation_link_id');
    }
}
