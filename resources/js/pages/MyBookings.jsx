import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Calendar, Clock, Eye, XCircle, CheckCircle } from 'lucide-react';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        api.get('/bookings')
            .then(r => setBookings(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const cancelBooking = async (id) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.put(`/bookings/${id}`, { status: 'cancelled' });
            loadBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Bookings</h1>
                <Link to="/services" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    New Booking
                </Link>
            </div>

            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-900">{booking.service?.name}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(booking.booking_date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.booking_time}</span>
                                        <span className="font-medium text-amber-600">₱{Number(booking.total).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Ref: {booking.booking_reference}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/booking-confirmation/${booking.id}`} className="p-2 text-gray-400 hover:text-amber-600 transition" title="View Details">
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                        <button onClick={() => cancelBooking(booking.id)} className="p-2 text-gray-400 hover:text-red-500 transition" title="Cancel Booking">
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-4">No bookings yet</p>
                    <Link to="/services" className="text-amber-600 hover:text-amber-700 font-medium">Browse Services</Link>
                </div>
            )}
        </div>
    );
}
