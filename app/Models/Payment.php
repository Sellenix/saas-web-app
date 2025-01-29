<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'surveys',
        'status',
        'mollie_payment_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

