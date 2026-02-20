import React, { useEffect, useState } from 'react';
import api from '../../api';
import { getImageSrc } from '../../utils/imageHelpers';
import { Calendar, Search, Eye, CheckCircle, XCircle, Clock, MapPin, Phone, ArrowRight, X } from 'lucide-react';

const STATUS_CONFIG = {
    pending: { color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', label: 'Pending' },
    confirmed: { color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500', label: 'Confirmed' },
    completed: { color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500', label: 'Completed' },
    cancelled: { color: 'bg-red-50 text-red-600', dot: 'bg-red-500', label: 'Cancelled' },
};

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => { loadBookings(); }, []);

    const loadBookings = () => {
        api.get('/bookings').then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/bookings/${id}`, { status });
            loadBookings();
            setSelectedBooking(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update');
        }
    };

    const filtered = bookings.filter(b => {
        const matchesSearch = b.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
            b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
            b.service?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading bookings...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{bookings.length} total bookings</p>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                    { key: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
                    { key: 'pending', label: 'Pending', color: 'bg-amber-50 text-amber-700' },
                    { key: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-700' },
                    { key: 'completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700' },
                    { key: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                            statusFilter === tab.key
                                ? `${tab.color} ring-2 ring-offset-1 ring-gray-200`
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                        }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                            statusFilter === tab.key ? 'bg-white/60' : 'bg-gray-100'
                        }`}>{statusCounts[tab.key]}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text" placeholder="Search by reference, customer, or service..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Reference</th>
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Customer</th>
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Service</th>
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Schedule</th>
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Total</th>
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Payment</th>
                                <th className="text-left py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Status</th>
                                <th className="text-right py-3.5 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => {
                                const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                                return (
                                    <tr key={b.id} className="border-b border-gray-50 hover:bg-amber-50/20 transition">
                                        <td className="py-3.5 px-5 font-mono text-xs text-gray-500">{b.booking_reference}</td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                                                    {b.customer_name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{b.customer_name}</p>
                                                    <p className="text-xs text-gray-400">{b.customer_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={getImageSrc(b.service, 'services', b.id)} alt={b.service?.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{b.service?.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <p className="text-gray-700">{new Date(b.booking_date).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-400">{b.booking_time}</p>
                                        </td>
                                        <td className="py-3.5 px-5 font-bold text-gray-900">₱{Number(b.total).toLocaleString()}</td>
                                        <td className="py-3.5 px-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                b.payment?.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${b.payment?.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {b.payment?.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setSelectedBooking(b)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {b.status === 'pending' && (
                                                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Confirm">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {b.status === 'confirmed' && (
                                                    <button onClick={() => updateStatus(b.id, 'completed')} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Complete">
                                                        <Clock className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {(b.status === 'pending' || b.status === 'confirmed') && (
                                                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Cancel">
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No bookings found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-t-2xl relative">
                            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-white/60 hover:text-white transition">
                                <X className="h-5 w-5" />
                            </button>
                            <p className="text-amber-400 text-sm font-medium mb-1">Booking Details</p>
                            <p className="text-white font-mono text-lg">{selectedBooking.booking_reference}</p>
                            <div className="mt-3">
                                {(() => {
                                    const sc = STATUS_CONFIG[selectedBooking.status] || STATUS_CONFIG.pending;
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                            {sc.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Customer</h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {selectedBooking.customer_name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{selectedBooking.customer_name}</p>
                                        <p className="text-xs text-gray-400">{selectedBooking.customer_email}</p>
                                    </div>
                                </div>
                                {selectedBooking.customer_phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                                        {selectedBooking.customer_phone}
                                    </div>
                                )}
                                {selectedBooking.location_address && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                        <span className="line-clamp-2">{selectedBooking.location_address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Booking Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Booking Info</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><p className="text-gray-400 text-xs">Service</p><p className="font-medium text-gray-900">{selectedBooking.service?.name}</p></div>
                                    <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium text-gray-900">{selectedBooking.booking_date}</p></div>
                                    <div><p className="text-gray-400 text-xs">Time</p><p className="font-medium text-gray-900">{selectedBooking.booking_time}</p></div>
                                    <div><p className="text-gray-400 text-xs">Total</p><p className="font-bold text-amber-600 text-lg">₱{Number(selectedBooking.total).toLocaleString()}</p></div>
                                </div>
                            </div>

                            {selectedBooking.special_requests && (
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Special Requests</h3>
                                    <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg">{selectedBooking.special_requests}</p>
                                </div>
                            )}

                            {selectedBooking.addons?.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Add-ons</h3>
                                    <div className="space-y-2">
                                        {selectedBooking.addons.map(a => (
                                            <div key={a.id} className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                                                <span className="text-gray-700">{a.name} x{a.quantity}</span>
                                                <span className="font-medium text-gray-900">₱{(Number(a.price) * a.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="flex gap-2 pt-2">
                                {selectedBooking.status === 'pending' && (
                                    <button onClick={() => updateStatus(selectedBooking.id, 'confirmed')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Confirm
                                    </button>
                                )}
                                {selectedBooking.status === 'confirmed' && (
                                    <button onClick={() => updateStatus(selectedBooking.id, 'completed')} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Mark Completed
                                    </button>
                                )}
                                {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                                    <button onClick={() => updateStatus(selectedBooking.id, 'cancelled')} className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition">
                                        Cancel
                                    </button>
                                )}
                                <button onClick={() => setSelectedBooking(null)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
