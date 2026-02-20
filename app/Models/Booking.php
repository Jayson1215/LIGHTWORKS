<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference', 'user_id', 'service_id', 'booking_date', 'booking_time',
        'customer_name', 'customer_email', 'customer_phone', 'special_requests',
        'subtotal', 'tax', 'discount', 'total', 'status', 'payment_method'
    ];

    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function addons()
    {
        return $this->hasMany(BookingAddon::class);
    }

    public static function generateReference()
    {
        return 'BK-' . strtoupper(uniqid()) . '-' . date('Ymd');
    }
}
