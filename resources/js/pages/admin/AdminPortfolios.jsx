import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Plus, Pencil, Trash2, X, Camera, Star, ImageIcon } from 'lucide-react';

export default function AdminPortfolios() {
    const [portfolios, setPortfolios] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ category_id: '', title: '', description: '', featured: false });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = () => {
        Promise.all([api.get('/portfolios'), api.get('/categories')])
            .then(([p, c]) => { setPortfolios(p.data); setCategories(c.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ category_id: categories[0]?.id || '', title: '', description: '', featured: false });
        setShowForm(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({ category_id: p.category_id, title: p.title, description: p.description || '', featured: p.featured });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('category_id', form.category_id);
            data.append('title', form.title);
            data.append('description', form.description);
            data.append('featured', form.featured ? '1' : '0');
            if (form.image) data.append('image', form.image);

            if (editing) {
                await api.put(`/admin/portfolios/${editing.id}`, {
                    category_id: form.category_id,
                    title: form.title,
                    description: form.description,
                    featured: form.featured,
                });
            } else {
                await api.post('/admin/portfolios', data, {
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
        if (!confirm('Delete this portfolio item?')) return;
        try { await api.delete(`/admin/portfolios/${id}`); loadData(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading portfolio...</p>
            </div>
        </div>
    );

    const featured = portfolios.filter(p => p.featured);
    const regular = portfolios.filter(p => !p.featured);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Portfolio</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{portfolios.length} items &middot; {featured.length} featured</p>
                </div>
                <button onClick={openCreate} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {portfolios.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-0.5">
                        {/* Image Area */}
                        <div className="h-44 bg-gradient-to-br from-gray-100 via-amber-50 to-rose-50 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Camera className="h-12 w-12 text-gray-300 group-hover:scale-110 transition-transform" />
                            {p.featured && (
                                <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                    <Star className="h-3 w-3 fill-current" /> Featured
                                </div>
                            )}
                            {/* Hover Actions */}
                            <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <button onClick={() => openEdit(p)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-gray-600 hover:text-amber-600 shadow-lg transition">
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-gray-600 hover:text-red-600 shadow-lg transition">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{p.category?.name}</span>
                            <h3 className="font-semibold text-gray-900 text-sm mt-0.5 line-clamp-1">{p.title}</h3>
                            {p.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {portfolios.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No portfolio items yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start showcasing your best photography work!</p>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update item details' : 'Add a new portfolio showcase'}</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-gray-50">
                                    <option value="">Select</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="e.g. Beach Wedding Shoot" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="Brief description of this work..." />
                            </div>
                            {!editing && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image</label>
                                    <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-amber-50 file:text-amber-600 file:text-sm file:font-medium" />
                                </div>
                            )}
                            <div className="flex items-center gap-3 bg-amber-50/50 px-4 py-3 rounded-xl">
                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} id="featured" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                <label htmlFor="featured" className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                                    <Star className="h-3.5 w-3.5 text-amber-500" /> Mark as Featured
                                </label>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm shadow-lg shadow-amber-500/20">
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
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
