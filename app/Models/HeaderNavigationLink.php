<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeaderNavigationLink extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'url', 'order', 'is_active', 'type'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function dropdownItems()
    {
        return $this->hasMany(HeaderDropdownItem::class, 'navigation_link_id')->orderBy('order');
    }
}
