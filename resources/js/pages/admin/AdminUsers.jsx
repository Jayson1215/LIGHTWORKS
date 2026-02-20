import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Search, Shield, Trash2, Users } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                <div className="text-sm text-gray-400">{users.length} total</div>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
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
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">User</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Email</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Phone</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Role</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Joined</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-medium text-amber-700">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{u.phone || '—'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {u.role === 'admin' && <Shield className="h-3 w-3" />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => toggleRole(u)}
                                                className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
                                            >
                                                {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
