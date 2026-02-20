import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Search, Shield, Trash2, Users, Mail, Phone, Calendar, UserCheck, UserX } from 'lucide-react';

const AVATAR_GRADIENTS = [
    'from-amber-400 to-orange-500',
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-violet-400 to-purple-500',
    'from-pink-400 to-rose-500',
    'from-cyan-400 to-blue-500',
];

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = () => {
        api.get('/admin/users')
            .then(r => setUsers(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
        try {
            await api.put(`/admin/users/${user.id}`, { role: newRole });
            loadUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        try { await api.delete(`/admin/users/${id}`); loadUsers(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    };

    const adminCount = users.filter(u => u.role === 'admin').length;
    const customerCount = users.filter(u => u.role === 'customer').length;

    const filtered = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading users...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-sm text-gray-400 mt-0.5">{users.length} registered users</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-blue-50 p-3 rounded-xl"><Users className="h-5 w-5 text-blue-600" /></div>
                    </div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-violet-50 p-3 rounded-xl"><Shield className="h-5 w-5 text-violet-600" /></div>
                    </div>
                    <p className="text-sm text-gray-500">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-amber-50 p-3 rounded-xl"><UserCheck className="h-5 w-5 text-amber-600" /></div>
                    </div>
                    <p className="text-sm text-gray-500">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{customerCount}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'admin', 'customer'].map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                                roleFilter === r
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                            }`}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((u, idx) => {
                    const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
                    return (
                        <div key={u.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all">
                            {/* Card Header */}
                            <div className="p-5 pb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-gray-200`}>
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 truncate">{u.name}</h3>
                                            {u.role === 'admin' && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 uppercase tracking-wider flex-shrink-0">
                                                    <Shield className="h-2.5 w-2.5" /> Admin
                                                </span>
                                            )}
                                            {u.role === 'customer' && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wider flex-shrink-0">
                                                    Customer
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                                            <Mail className="h-3 w-3" />
                                            <span className="text-xs truncate">{u.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="px-5 pb-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{u.phone || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    <span>Joined {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="border-t border-gray-50 px-5 py-3 flex items-center gap-2 bg-gray-50/30">
                                <button onClick={() => toggleRole(u)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition ${
                                        u.role === 'admin'
                                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                            : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                                    }`}>
                                    {u.role === 'admin' ? <UserX className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                                    {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                                </button>
                                <button onClick={() => handleDelete(u.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <Users className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No users found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}
