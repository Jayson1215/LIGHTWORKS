import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Plus, Pencil, Trash2, X, Camera } from 'lucide-react';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ category_id: '', name: '', description: '', price: '', duration_hours: 1, inclusions: '', is_available: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        Promise.all([api.get('/services'), api.get('/categories')])
            .then(([s, c]) => { setServices(s.data); setCategories(c.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ category_id: categories[0]?.id || '', name: '', description: '', price: '', duration_hours: 1, inclusions: '', is_available: true });
        setShowForm(true);
    };

    const openEdit = (svc) => {
        setEditing(svc);
        setForm({
            category_id: svc.category_id,
            name: svc.name,
            description: svc.description,
            price: svc.price,
            duration_hours: svc.duration_hours,
            inclusions: svc.inclusions ? svc.inclusions.join('\n') : '',
            is_available: svc.is_available,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                ...form,
                inclusions: form.inclusions ? form.inclusions.split('\n').map(s => s.trim()).filter(Boolean) : [],
            };
            if (editing) {
                await api.put(`/admin/services/${editing.id}`, data);
            } else {
                await api.post('/admin/services', data);
            }
            setShowForm(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this service?')) return;
        try {
            await api.delete(`/admin/services/${id}`);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
                <button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(svc => (
                    <div key={svc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{svc.category?.name}</span>
                                <h3 className="font-semibold text-gray-900 mt-1">{svc.name}</h3>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${svc.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {svc.is_available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{svc.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-amber-600">₱{Number(svc.price).toLocaleString()}</span>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(svc)} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(svc.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No services yet. Create your first service!</p>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Service' : 'Add Service'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                                    <input type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                                    <input type="number" required min="1" value={form.duration_hours} onChange={e => setForm({ ...form, duration_hours: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (one per line)</label>
                                <textarea rows={4} value={form.inclusions} onChange={e => setForm({ ...form, inclusions: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" placeholder="50 edited photos\n1-hour session\nOnline gallery" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} id="available" className="rounded border-gray-300" />
                                <label htmlFor="available" className="text-sm text-gray-700">Available for booking</label>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={saving} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50">
                                    {saving ? 'Saving...' : editing ? 'Update Service' : 'Create Service'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
