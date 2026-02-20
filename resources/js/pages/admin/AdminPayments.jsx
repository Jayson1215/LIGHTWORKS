import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Search, CreditCard, Eye, X, DollarSign, CheckCircle, XCircle, ArrowUpRight, Clock } from 'lucide-react';

const STATUS_CONFIG = {
    pending: { color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', label: 'Pending' },
    paid: { color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500', label: 'Paid' },
    failed: { color: 'bg-red-50 text-red-600', dot: 'bg-red-500', label: 'Failed' },
    refunded: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Refunded' },
};

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [detail, setDetail] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

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

    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const filtered = payments.filter(p => {
        const matchesSearch = p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
            p.booking?.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
            p.booking?.customer_name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading payments...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-sm text-gray-400 mt-0.5">{payments.length} total transactions</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-emerald-50 p-3 rounded-xl"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-gray-500">Total Collected</p>
                    <p className="text-2xl font-bold text-gray-900">₱{paidAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-amber-50 p-3 rounded-xl"><Clock className="h-5 w-5 text-amber-600" /></div>
                        <ArrowUpRight className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">₱{pendingAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-blue-50 p-3 rounded-xl"><CreditCard className="h-5 w-5 text-blue-600" /></div>
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₱{totalAmount.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search by transaction ID, booking reference, or customer..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {['all', 'pending', 'paid', 'failed', 'refunded'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                                statusFilter === s
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Transaction</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Booking</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Method</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                                <th className="text-right py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => {
                                const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                                return (
                                    <tr key={p.id} className="border-b border-gray-50 hover:bg-amber-50/20 transition">
                                        <td className="py-3.5 px-5 text-sm font-mono text-gray-600">{p.transaction_id}</td>
                                        <td className="py-3.5 px-5 text-sm text-amber-600 font-semibold">{p.booking?.booking_reference || '—'}</td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                                                    {p.booking?.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="text-sm text-gray-700">{p.booking?.customer_name || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm font-bold text-gray-900">₱{parseFloat(p.amount).toLocaleString()}</td>
                                        <td className="py-3.5 px-5 text-sm text-gray-600 capitalize">{p.method?.replace('_', ' ')}</td>
                                        <td className="py-3.5 px-5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                                        <td className="py-3.5 px-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setDetail(p)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {p.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => updateStatus(p.id, 'paid')} className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition">Paid</button>
                                                        <button onClick={() => updateStatus(p.id, 'failed')} className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition">Fail</button>
                                                    </>
                                                )}
                                                {p.status === 'paid' && (
                                                    <button onClick={() => updateStatus(p.id, 'refunded')} className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition">Refund</button>
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
                        <CreditCard className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No payments found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-t-2xl relative">
                            <button onClick={() => setDetail(null)} className="absolute top-4 right-4 text-white/60 hover:text-white transition">
                                <X className="h-5 w-5" />
                            </button>
                            <p className="text-amber-400 text-sm font-medium mb-1">Payment Details</p>
                            <p className="text-white font-mono text-lg">{detail.transaction_id}</p>
                            <div className="mt-3">
                                {(() => {
                                    const sc = STATUS_CONFIG[detail.status] || STATUS_CONFIG.pending;
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                            {sc.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">Amount</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">₱{parseFloat(detail.amount).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-gray-400">Booking Ref</span>
                                    <span className="text-amber-600 font-semibold">{detail.booking?.booking_reference}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-gray-400">Customer</span>
                                    <span className="text-gray-900 font-medium">{detail.booking?.customer_name}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-gray-400">Method</span>
                                    <span className="text-gray-900 capitalize">{detail.method?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Date</span>
                                    <span className="text-gray-900">{new Date(detail.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            {detail.notes && (
                                <div className="bg-amber-50 p-3 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-1 font-medium">Notes</p>
                                    <p className="text-sm text-gray-700">{detail.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
