import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { CheckCircle, Calendar, Clock, User, CreditCard, ArrowRight } from 'lucide-react';

export default function BookingConfirmation() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/bookings/${id}`)
            .then(r => setBooking(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
    if (!booking) return <div className="text-center py-20 text-gray-500">Booking not found.</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center mb-6 sm:mb-8">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Your booking has been successfully created.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="text-xl font-bold text-amber-600 font-mono">{booking.booking_reference}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">{new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-medium text-gray-900">{booking.booking_time}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500">Customer</p>
                            <p className="font-medium text-gray-900">{booking.customer_name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500">Payment</p>
                            <p className="font-medium text-gray-900 capitalize">{booking.payment_method?.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Service: {booking.service?.name}</h3>
                    {booking.addons && booking.addons.length > 0 && (
                        <div className="text-sm space-y-1 mb-3">
                            {booking.addons.map(a => (
                                <div key={a.id} className="flex justify-between text-gray-600">
                                    <span>{a.name} x{a.quantity}</span>
                                    <span>₱{(Number(a.price) * a.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span><span>₱{Number(booking.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span><span>₱{Number(booking.tax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span>Total</span><span className="text-amber-600">₱{Number(booking.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </span>
                    {booking.payment && (
                        <span className={`px-3 py-1 rounded-full font-medium ${
                            booking.payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            Payment: {booking.payment.status}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Link to="/my-bookings" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2">
                    View My Bookings <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/services" className="border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition">
                    Book Another
                </Link>
            </div>
        </div>
    );
}
