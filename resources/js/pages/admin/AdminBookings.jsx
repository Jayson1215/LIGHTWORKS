import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Calendar, Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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

    const filtered = bookings.filter(b =>
        b.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
        b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        b.service?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const statusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text" placeholder="Search by reference, customer, or service..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Reference</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Service</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Date/Time</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => (
                                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-mono text-xs">{b.booking_reference}</td>
                                    <td className="py-3 px-4">
                                        <p className="font-medium">{b.customer_name}</p>
                                        <p className="text-xs text-gray-400">{b.customer_email}</p>
                                    </td>
                                    <td className="py-3 px-4">{b.service?.name}</td>
                                    <td className="py-3 px-4">
                                        <p>{new Date(b.booking_date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-400">{b.booking_time}</p>
                                    </td>
                                    <td className="py-3 px-4 font-medium">₱{Number(b.total).toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            b.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>{b.payment?.status || 'N/A'}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(b.status)}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-1">
                                            <button onClick={() => setSelectedBooking(b)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded" title="View">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {b.status === 'pending' && (
                                                <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-1.5 text-gray-400 hover:text-green-600 rounded" title="Confirm">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {b.status === 'confirmed' && (
                                                <button onClick={() => updateStatus(b.id, 'completed')} className="p-1.5 text-gray-400 hover:text-blue-600 rounded" title="Complete">
                                                    <Clock className="h-4 w-4" />
                                                </button>
                                            )}
                                            {(b.status === 'pending' || b.status === 'confirmed') && (
                                                <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-1.5 text-gray-400 hover:text-red-600 rounded" title="Cancel">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-400">No bookings found</div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Details</h2>
                        <div className="space-y-3 text-sm">
                            <div><span className="text-gray-500">Reference:</span> <span className="font-mono">{selectedBooking.booking_reference}</span></div>
                            <div><span className="text-gray-500">Customer:</span> {selectedBooking.customer_name} ({selectedBooking.customer_email})</div>
                            <div><span className="text-gray-500">Phone:</span> {selectedBooking.customer_phone}</div>
                            <div><span className="text-gray-500">Service:</span> {selectedBooking.service?.name}</div>
                            <div><span className="text-gray-500">Date:</span> {selectedBooking.booking_date} at {selectedBooking.booking_time}</div>
                            <div><span className="text-gray-500">Total:</span> ₱{Number(selectedBooking.total).toLocaleString()}</div>
                            {selectedBooking.special_requests && <div><span className="text-gray-500">Special Requests:</span> {selectedBooking.special_requests}</div>}
                            {selectedBooking.addons?.length > 0 && (
                                <div>
                                    <span className="text-gray-500">Add-ons:</span>
                                    <ul className="ml-4 mt-1 space-y-1">{selectedBooking.addons.map(a => <li key={a.id}>• {a.name} x{a.quantity} - ₱{(Number(a.price) * a.quantity).toLocaleString()}</li>)}</ul>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSelectedBooking(null)} className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
