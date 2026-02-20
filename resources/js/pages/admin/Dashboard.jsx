import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Calendar, DollarSign, Users, Camera, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(r => setStats(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
    if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load dashboard.</div>;

    const statCards = [
        { label: 'Total Bookings', value: stats.total_bookings, icon: Calendar, color: 'bg-blue-500' },
        { label: 'Total Revenue', value: `₱${Number(stats.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { label: 'Customers', value: stats.total_customers, icon: Users, color: 'bg-purple-500' },
        { label: 'Services', value: stats.total_services, icon: Camera, color: 'bg-amber-500' },
        { label: 'Pending Bookings', value: stats.pending_bookings, icon: Clock, color: 'bg-yellow-500' },
        { label: 'Pending Payments', value: `₱${Number(stats.pending_payments || 0).toLocaleString()}`, icon: TrendingUp, color: 'bg-red-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-4">
                            <div className={`${card.color} rounded-lg p-3`}>
                                <card.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Status Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Booking Status</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Pending', value: stats.pending_bookings, color: 'bg-yellow-500' },
                            { label: 'Confirmed', value: stats.confirmed_bookings, color: 'bg-blue-500' },
                            { label: 'Completed', value: stats.completed_bookings, color: 'bg-green-500' },
                            { label: 'Cancelled', value: stats.cancelled_bookings, color: 'bg-red-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </div>
                                <span className="font-semibold text-gray-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Popular Services</h2>
                    {stats.popular_services?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.popular_services.map(svc => (
                                <div key={svc.id} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{svc.name}</span>
                                    <span className="text-sm font-semibold text-amber-600">{svc.bookings_count} bookings</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No data yet</p>
                    )}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Recent Bookings</h2>
                {stats.recent_bookings?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-3 font-medium text-gray-500">Reference</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-500">Customer</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-500">Service</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-500">Date</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-500">Total</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_bookings.map(b => (
                                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-2 px-3 font-mono text-xs">{b.booking_reference}</td>
                                        <td className="py-2 px-3">{b.user?.name}</td>
                                        <td className="py-2 px-3">{b.service?.name}</td>
                                        <td className="py-2 px-3">{new Date(b.booking_date).toLocaleDateString()}</td>
                                        <td className="py-2 px-3 font-medium">₱{Number(b.total).toLocaleString()}</td>
                                        <td className="py-2 px-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                b.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No bookings yet</p>
                )}
            </div>
        </div>
    );
}
