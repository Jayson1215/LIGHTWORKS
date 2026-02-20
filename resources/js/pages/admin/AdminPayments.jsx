import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Search, CreditCard, Eye, X } from 'lucide-react';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
};

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [detail, setDetail] = useState(null);

    useEffect(() => { loadPayments(); }, []);

    const loadPayments = () => {
        api.get('/admin/payments')
            .then(r => setPayments(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/payments/${id}`, { status });
            loadPayments();
            if (detail?.id === id) setDetail({ ...detail, status });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update');
        }
    };

    const filtered = payments.filter(p =>
        p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking?.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking?.customer_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{payments.length} records</span>
                    <span>₱{payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toLocaleString()}</span>
                </div>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by transaction ID, booking reference, or customer..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Transaction</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Booking</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Customer</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Amount</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Method</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Date</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="py-3 px-4 text-sm font-mono text-gray-900">{p.transaction_id}</td>
                                    <td className="py-3 px-4 text-sm text-amber-600 font-medium">{p.booking?.booking_reference || '—'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{p.booking?.customer_name || '—'}</td>
                                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">₱{parseFloat(p.amount).toLocaleString()}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">{p.method?.replace('_', ' ')}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setDetail(p)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {p.status === 'pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(p.id, 'paid')} className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100">Mark Paid</button>
                                                    <button onClick={() => updateStatus(p.id, 'failed')} className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Fail</button>
                                                </>
                                            )}
                                            {p.status === 'paid' && (
                                                <button onClick={() => updateStatus(p.id, 'refunded')} className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600 hover:bg-gray-100">Refund</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No payments found.</p>
                    </div>
                )}
            </div>

            {detail && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
                    <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
                            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Transaction ID</span><span className="font-mono text-gray-900">{detail.transaction_id}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Booking Ref</span><span className="text-amber-600 font-medium">{detail.booking?.booking_reference}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Customer</span><span className="text-gray-900">{detail.booking?.customer_name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="font-bold text-gray-900">₱{parseFloat(detail.amount).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Method</span><span className="text-gray-900 capitalize">{detail.method?.replace('_', ' ')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[detail.status]}`}>{detail.status}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="text-gray-900">{new Date(detail.created_at).toLocaleString()}</span></div>
                            {detail.notes && <div className="pt-2 border-t border-gray-100"><p className="text-gray-400 mb-1">Notes</p><p className="text-gray-700">{detail.notes}</p></div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
