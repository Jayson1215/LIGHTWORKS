<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use App\Models\Service;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $confirmedBookings = Booking::where('status', 'confirmed')->count();
        $completedBookings = Booking::where('status', 'completed')->count();
        $cancelledBookings = Booking::where('status', 'cancelled')->count();

        $totalRevenue = Payment::where('status', 'paid')->sum('amount');
        $pendingPayments = Payment::where('status', 'pending')->sum('amount');

        $totalCustomers = User::where('role', 'customer')->count();
        $totalServices = Service::count();
        $totalPortfolios = Portfolio::count();

        // Monthly revenue for the last 6 months
        $monthlyRevenue = Payment::where('status', 'paid')
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent bookings
        $recentBookings = Booking::with(['user', 'service', 'payment'])
            ->latest()
            ->take(10)
            ->get();

        // Popular services
        $popularServices = Service::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get();

        return response()->json([
            'total_bookings' => $totalBookings,
            'pending_bookings' => $pendingBookings,
            'confirmed_bookings' => $confirmedBookings,
            'completed_bookings' => $completedBookings,
            'cancelled_bookings' => $cancelledBookings,
            'total_revenue' => $totalRevenue,
            'pending_payments' => $pendingPayments,
            'total_customers' => $totalCustomers,
            'total_services' => $totalServices,
            'total_portfolios' => $totalPortfolios,
            'monthly_revenue' => $monthlyRevenue,
            'recent_bookings' => $recentBookings,
            'popular_services' => $popularServices,
        ]);
    }
}
