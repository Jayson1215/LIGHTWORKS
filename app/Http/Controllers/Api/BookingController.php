<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingAddon;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Service;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $bookings = Booking::with(['user', 'service.category', 'payment', 'addons'])
                ->latest()
                ->get();
        } else {
            $bookings = $user->bookings()
                ->with(['service.category', 'payment', 'addons'])
                ->latest()
                ->get();
        }

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date|after:today',
            'booking_time' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'location_address' => 'nullable|string|max:500',
            'location_lat' => 'nullable|numeric',
            'location_lng' => 'nullable|numeric',
            'special_requests' => 'nullable|string',
            'payment_method' => 'required|in:online,in_person',
            'addons' => 'nullable|array',
            'addons.*.name' => 'required_with:addons|string',
            'addons.*.price' => 'required_with:addons|numeric|min:0',
            'addons.*.quantity' => 'sometimes|integer|min:1',
        ]);

        $service = Service::findOrFail($request->service_id);

        // Check if the date/time slot is available
        $existing = Booking::where('service_id', $request->service_id)
            ->where('booking_date', $request->booking_date)
            ->where('booking_time', $request->booking_time)
            ->whereNotIn('status', ['cancelled'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'This time slot is already booked. Please choose another date/time.'
            ], 422);
        }

        // Calculate costs
        $subtotal = $service->price;
        $addonsTotal = 0;

        if ($request->has('addons')) {
            foreach ($request->addons as $addon) {
                $qty = $addon['quantity'] ?? 1;
                $addonsTotal += $addon['price'] * $qty;
            }
        }

        $subtotal += $addonsTotal;
        $tax = round($subtotal * 0.12, 2); // 12% VAT
        $total = $subtotal + $tax;

        $booking = Booking::create([
            'booking_reference' => Booking::generateReference(),
            'user_id' => $request->user()->id,
            'service_id' => $request->service_id,
            'booking_date' => $request->booking_date,
            'booking_time' => $request->booking_time,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'location_address' => $request->location_address,
            'location_lat' => $request->location_lat,
            'location_lng' => $request->location_lng,
            'special_requests' => $request->special_requests,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => 0,
            'total' => $total,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
        ]);

        // Create addons
        if ($request->has('addons')) {
            foreach ($request->addons as $addon) {
                BookingAddon::create([
                    'booking_id' => $booking->id,
                    'name' => $addon['name'],
                    'description' => $addon['description'] ?? null,
                    'price' => $addon['price'],
                    'quantity' => $addon['quantity'] ?? 1,
                ]);
            }
        }

        // Create payment record
        Payment::create([
            'booking_id' => $booking->id,
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'amount' => $total,
            'method' => $request->payment_method,
            'status' => $request->payment_method === 'online' ? 'paid' : 'pending',
        ]);

        $booking->load(['service.category', 'payment', 'addons', 'user']);

        // Create admin notification for new booking
        Notification::create([
            'type' => 'new_booking',
            'title' => 'New Booking Received',
            'message' => "{$request->customer_name} booked {$service->name} on {$request->booking_date} at {$request->booking_time}.",
            'data' => [
                'booking_id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'customer_name' => $request->customer_name,
                'service_name' => $service->name,
                'booking_date' => $request->booking_date,
                'booking_time' => $request->booking_time,
                'total' => $total,
            ],
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    public function show(Booking $booking)
    {
        $booking->load(['service.category', 'payment', 'addons', 'user']);
        return response()->json($booking);
    }

    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'booking_date' => 'sometimes|date|after:today',
            'booking_time' => 'sometimes|string',
            'special_requests' => 'nullable|string',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
        ]);

        // Only allow modifications if not yet completed
        if (in_array($booking->status, ['completed', 'cancelled'])) {
            return response()->json([
                'message' => 'Cannot modify a ' . $booking->status . ' booking.'
            ], 422);
        }

        $booking->update($request->only('booking_date', 'booking_time', 'special_requests', 'status'));

        // If cancelled, update payment status
        if ($request->status === 'cancelled' && $booking->payment) {
            $booking->payment->update(['status' => 'refunded']);
        }

        $booking->load(['service.category', 'payment', 'addons', 'user']);

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking,
        ]);
    }

    public function destroy(Booking $booking)
    {
        if ($booking->status === 'completed') {
            return response()->json([
                'message' => 'Cannot delete a completed booking.'
            ], 422);
        }

        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully']);
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
        ]);

        $bookedSlots = Booking::where('service_id', $request->service_id)
            ->where('booking_date', $request->date)
            ->whereNotIn('status', ['cancelled'])
            ->pluck('booking_time')
            ->toArray();

        $allSlots = [
            '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00'
        ];

        $available = array_values(array_diff($allSlots, $bookedSlots));

        return response()->json($available);
    }
}
