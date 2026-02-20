<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $payments = Payment::with('booking.user', 'booking.service')->latest()->get();
        } else {
            $payments = Payment::whereHas('booking', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with('booking.service')->latest()->get();
        }

        return response()->json($payments);
    }

    public function show(Payment $payment)
    {
        $payment->load('booking.user', 'booking.service');
        return response()->json($payment);
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string',
        ]);

        $payment->update($request->only('status', 'notes'));

        // Update booking status based on payment
        if ($request->status === 'paid') {
            $payment->booking->update(['status' => 'confirmed']);
        }

        $payment->load('booking.user', 'booking.service');

        return response()->json([
            'message' => 'Payment updated successfully',
            'payment' => $payment,
        ]);
    }
}
