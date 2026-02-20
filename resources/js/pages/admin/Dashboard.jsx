import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { getImageSrc } from '../../utils/imageHelpers';
import { Calendar, DollarSign, Users, Camera, TrendingUp, Clock, ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(r => setStats(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading dashboard...</p>
            </div>
        </div>
    );
    if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load dashboard.</div>;

    const statCards = [
        { label: 'Total Bookings', value: stats.total_bookings, icon: Calendar, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
        { label: 'Total Revenue', value: `₱${Number(stats.total_revenue || 0).toLocaleString()}`, icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { label: 'Customers', value: stats.total_customers, icon: Users, gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
        { label: 'Services', value: stats.total_services, icon: Camera, gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
        { label: 'Pending Bookings', value: stats.pending_bookings, icon: Clock, gradient: 'from-orange-400 to-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
        { label: 'Pending Payments', value: `₱${Number(stats.pending_payments || 0).toLocaleString()}`, icon: TrendingUp, gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
    ];

    const totalBookings = (stats.pending_bookings || 0) + (stats.confirmed_bookings || 0) + (stats.completed_bookings || 0) + (stats.cancelled_bookings || 0);

    const statusItems = [
        { label: 'Pending', value: stats.pending_bookings || 0, color: 'bg-amber-400', light: 'bg-amber-100' },
        { label: 'Confirmed', value: stats.confirmed_bookings || 0, color: 'bg-blue-500', light: 'bg-blue-100' },
        { label: 'Completed', value: stats.completed_bookings || 0, color: 'bg-emerald-500', light: 'bg-emerald-100' },
        { label: 'Cancelled', value: stats.cancelled_bookings || 0, color: 'bg-red-400', light: 'bg-red-100' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                        <span className="text-amber-400/80 text-sm font-medium">Overview</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Studio Dashboard</h1>
                    <p className="text-gray-400 text-sm">Here's what's happening with your photography business today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${card.bg} p-3 rounded-xl`}>
                                <card.icon className={`h-5 w-5 ${card.text}`} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Status with Progress Bars */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-gray-900">Booking Status</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{totalBookings} total bookings</p>
                        </div>
                        <Link to="/admin/bookings" className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {/* Visual Bar */}
                    {totalBookings > 0 && (
                        <div className="flex h-3 rounded-full overflow-hidden mb-6 bg-gray-100">
                            {statusItems.map((item, i) => (
                                item.value > 0 && (
                                    <div
                                        key={i}
                                        className={`${item.color} transition-all duration-500`}
                                        style={{ width: `${(item.value / totalBookings) * 100}%` }}
                                    />
                                )
                            ))}
                        </div>
                    )}

                    <div className="space-y-4">
                        {statusItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
                                <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                <span className="text-xs text-gray-400 w-12 text-right">
                                    {totalBookings > 0 ? Math.round((item.value / totalBookings) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Services */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-gray-900">Popular Services</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Most booked services</p>
                        </div>
                        <Link to="/admin/services" className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    {stats.popular_services?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.popular_services.map((svc, i) => {
                                const maxBookings = stats.popular_services[0]?.bookings_count || 1;
                                const percent = (svc.bookings_count / maxBookings) * 100;
                                return (
                                    <div key={svc.id}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={getImageSrc(svc, 'services', i)} alt={svc.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{svc.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-amber-600">{svc.bookings_count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                            <Camera className="h-10 w-10 mb-2" />
                            <p className="text-sm text-gray-400">No data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-0">
                    <div>
                        <h2 className="font-bold text-gray-900">Recent Bookings</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Latest booking activity</p>
                    </div>
                    <Link to="/admin/bookings" className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                        View all <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
                {stats.recent_bookings?.length > 0 ? (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-y border-gray-100 bg-gray-50/50">
                                    <th className="text-left py-3 px-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Reference</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Customer</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Service</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Date</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Total</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_bookings.map(b => (
                                    <tr key={b.id} className="border-b border-gray-50 hover:bg-amber-50/30 transition">
                                        <td className="py-3.5 px-6 font-mono text-xs text-gray-600">{b.booking_reference}</td>
                                        <td className="py-3.5 px-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {b.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium text-gray-800">{b.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-6 text-gray-600">{b.service?.name}</td>
                                        <td className="py-3.5 px-6 text-gray-500">{new Date(b.booking_date).toLocaleDateString()}</td>
                                        <td className="py-3.5 px-6 font-semibold text-gray-900">₱{Number(b.total).toLocaleString()}</td>
                                        <td className="py-3.5 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                b.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                                                b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                b.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    b.status === 'confirmed' ? 'bg-blue-500' :
                                                    b.status === 'completed' ? 'bg-emerald-500' :
                                                    b.status === 'cancelled' ? 'bg-red-500' :
                                                    'bg-amber-500'
                                                }`} />
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-400">
                        <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No bookings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
