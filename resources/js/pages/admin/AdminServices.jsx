import React, { useEffect, useState } from 'react';
import api from '../../api';
import { getImageSrc } from '../../utils/imageHelpers';
import { Plus, Pencil, Trash2, X, Camera, Clock, Tag, CheckCircle, XCircle, DollarSign } from 'lucide-react';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ category_id: '', name: '', description: '', price: '', duration_hours: 1, inclusions: '', is_available: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadData(); }, []);

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
            const inclusions = form.inclusions ? form.inclusions.split('\n').map(s => s.trim()).filter(Boolean) : [];
            if (editing) {
                const editData = new FormData();
                editData.append('category_id', form.category_id);
                editData.append('name', form.name);
                editData.append('description', form.description);
                editData.append('price', form.price);
                editData.append('duration_hours', form.duration_hours);
                editData.append('is_available', form.is_available ? '1' : '0');
                inclusions.forEach((inc, i) => editData.append(`inclusions[${i}]`, inc));
                if (form.image) editData.append('image', form.image);
                editData.append('_method', 'PUT');
                await api.post(`/admin/services/${editing.id}`, editData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                const data = new FormData();
                data.append('category_id', form.category_id);
                data.append('name', form.name);
                data.append('description', form.description);
                data.append('price', form.price);
                data.append('duration_hours', form.duration_hours);
                data.append('is_available', form.is_available ? '1' : '0');
                inclusions.forEach((inc, i) => data.append(`inclusions[${i}]`, inc));
                if (form.image) data.append('image', form.image);
                await api.post('/admin/services', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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
        try { await api.delete(`/admin/services/${id}`); loadData(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading services...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{services.length} services available</p>
                </div>
                <button onClick={openCreate} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {services.map((svc, idx) => (
                    <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-0.5">
                        {/* Service Image */}
                        <div className="h-36 relative overflow-hidden">
                            <img src={getImageSrc(svc, 'services', idx)} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                        <div className="px-5 pt-4 pb-4 relative">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                                        <Tag className="h-3 w-3" />
                                        {svc.category?.name}
                                    </span>
                                    <h3 className="font-bold text-gray-900 mt-2 text-lg">{svc.name}</h3>
                                </div>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${svc.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                    {svc.is_available ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                    {svc.is_available ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="px-5 pb-5">
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 mt-2">{svc.description}</p>

                            {/* Stats row */}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                    <span className="font-bold text-gray-900">₱{Number(svc.price).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Clock className="h-4 w-4 text-blue-400" />
                                    <span>{svc.duration_hours}h</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button onClick={() => openEdit(svc)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition">
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button onClick={() => handleDelete(svc.id)} className="flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-10 w-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No services yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first service to get started!</p>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Service' : 'New Service'}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update service details' : 'Create a new photography service'}</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-gray-50">
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="e.g. Wedding Premium Package" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₱)</label>
                                    <input type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (hours)</label>
                                    <input type="number" required min="1" value={form.duration_hours} onChange={e => setForm({ ...form, duration_hours: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Inclusions (one per line)</label>
                                <textarea rows={4} value={form.inclusions} onChange={e => setForm({ ...form, inclusions: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="50 edited photos&#10;1-hour session&#10;Online gallery" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{editing ? 'Change Image (optional)' : 'Image (optional)'}</label>
                                {editing?.image && !form.image && (
                                    <div className="mb-2 rounded-xl overflow-hidden h-28 bg-gray-50">
                                        <img src={getImageSrc(editing, 'services', 0)} alt="Current" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-amber-50 file:text-amber-600 file:text-sm file:font-medium" />
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
                                <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} id="available" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                <label htmlFor="available" className="text-sm text-gray-700 font-medium">Available for booking</label>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm shadow-lg shadow-amber-500/20">
                                    {saving ? 'Saving...' : editing ? 'Update Service' : 'Create Service'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
