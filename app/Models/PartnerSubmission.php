<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'company_name',
        'location',
        'phone_number',
        'email',
        'project_details',
    ];
}
