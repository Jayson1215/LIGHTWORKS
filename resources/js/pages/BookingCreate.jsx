import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { ArrowLeft, Calendar, Clock, Plus, Minus, X } from 'lucide-react';

const ADDON_OPTIONS = [
    { name: 'Extra Prints (10 pcs)', price: 500 },
    { name: 'Photo Editing (per photo)', price: 200 },
    { name: 'Rush Delivery', price: 1000 },
    { name: 'Additional Hour', price: 1500 },
    { name: 'Digital Album', price: 2000 },
];

export default function BookingCreate() {
    const { serviceId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        booking_date: '',
        booking_time: '',
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        special_requests: '',
        payment_method: 'online',
        addons: [],
    });

    useEffect(() => {
        api.get(`/services/${serviceId}`)
            .then(r => setService(r.data))
            .catch(() => navigate('/services'))
            .finally(() => setLoading(false));
    }, [serviceId]);

    useEffect(() => {
        if (form.booking_date) {
            api.get(`/available-slots?service_id=${serviceId}&date=${form.booking_date}`)
                .then(r => setAvailableSlots(r.data))
                .catch(() => setAvailableSlots([]));
        }
    }, [form.booking_date, serviceId]);

    const addAddon = (addon) => {
        const existing = form.addons.find(a => a.name === addon.name);
        if (existing) {
            setForm({
                ...form,
                addons: form.addons.map(a => a.name === addon.name ? { ...a, quantity: a.quantity + 1 } : a)
            });
        } else {
            setForm({ ...form, addons: [...form.addons, { ...addon, quantity: 1 }] });
        }
    };

    const removeAddon = (name) => {
        setForm({ ...form, addons: form.addons.filter(a => a.name !== name) });
    };

    const updateAddonQty = (name, qty) => {
        if (qty < 1) return removeAddon(name);
        setForm({
            ...form,
            addons: form.addons.map(a => a.name === name ? { ...a, quantity: qty } : a)
        });
    };

    const addonsTotal = form.addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
    const subtotal = service ? Number(service.price) + addonsTotal : 0;
    const tax = Math.round(subtotal * 0.12 * 100) / 100;
    const total = subtotal + tax;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await api.post('/bookings', {
                service_id: Number(serviceId),
                ...form,
            });
            navigate(`/booking-confirmation/${res.data.booking.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
    if (!service) return null;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 mb-4 sm:mb-6 text-sm font-medium">
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Book: {service.name}</h1>

            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Date & Time */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-amber-600" /> Select Date & Time</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date" required min={minDateStr}
                                    value={form.booking_date}
                                    onChange={e => setForm({ ...form, booking_date: e.target.value, booking_time: '' })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                                {form.booking_date ? (
                                    availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableSlots.map(slot => (
                                                <button
                                                    key={slot} type="button"
                                                    onClick={() => setForm({ ...form, booking_time: slot })}
                                                    className={`py-2 rounded-lg text-sm font-medium transition ${form.booking_time === slot ? 'bg-amber-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-amber-50 border border-gray-200'}`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-red-500 py-2">No available slots on this date</p>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-400 py-2">Select a date first</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" required value={form.customer_name}
                                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" required value={form.customer_email}
                                    onChange={e => setForm({ ...form, customer_email: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" required value={form.customer_phone}
                                    onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select value={form.payment_method}
                                    onChange={e => setForm({ ...form, payment_method: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none">
                                    <option value="online">Online Payment</option>
                                    <option value="in_person">Pay In Person</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (optional)</label>
                            <textarea rows={3} value={form.special_requests}
                                onChange={e => setForm({ ...form, special_requests: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                placeholder="Any special requirements or preferences..." />
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-gray-900 mb-4">Add-ons (Optional)</h2>
                        <div className="space-y-2">
                            {ADDON_OPTIONS.map(addon => {
                                const added = form.addons.find(a => a.name === addon.name);
                                return (
                                    <div key={addon.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{addon.name}</p>
                                            <p className="text-xs text-gray-500">₱{addon.price.toLocaleString()}</p>
                                        </div>
                                        {added ? (
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => updateAddonQty(addon.name, added.quantity - 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200">
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{added.quantity}</span>
                                                <button type="button" onClick={() => updateAddonQty(addon.name, added.quantity + 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200">
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                                <button type="button" onClick={() => removeAddon(addon.name)} className="p-1 rounded text-red-400 hover:text-red-600 ml-1">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => addAddon(addon)} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                                                <Plus className="h-4 w-4" /> Add
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
                        <h2 className="font-semibold text-gray-900 mb-4">Booking Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{service.name}</span>
                                <span className="font-medium">₱{Number(service.price).toLocaleString()}</span>
                            </div>
                            {form.addons.map(a => (
                                <div key={a.name} className="flex justify-between">
                                    <span className="text-gray-600">{a.name} x{a.quantity}</span>
                                    <span className="font-medium">₱{(a.price * a.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₱{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-gray-600">VAT (12%)</span>
                                    <span className="font-medium">₱{tax.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-bold text-amber-600">₱{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {form.booking_date && (
                            <div className="mt-4 text-sm text-gray-600 bg-amber-50 rounded-lg p-3">
                                <p><span className="font-medium">Date:</span> {form.booking_date}</p>
                                {form.booking_time && <p><span className="font-medium">Time:</span> {form.booking_time}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting || !form.booking_date || !form.booking_time}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition mt-6 disabled:opacity-50"
                        >
                            {submitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
