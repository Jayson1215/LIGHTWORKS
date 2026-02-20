import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Plus, Pencil, Trash2, X, Camera } from 'lucide-react';

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
            // For simplicity, send as JSON (no file upload via this form; image managed separately)
            const data = new FormData();
            data.append('category_id', form.category_id);
            data.append('title', form.title);
            data.append('description', form.description);
            data.append('featured', form.featured ? '1' : '0');
            if (form.image) data.append('image', form.image);

            if (editing) {
                // Use PUT with JSON for update
                await api.put(`/admin/portfolios/${editing.id}`, {
                    category_id: form.category_id,
                    title: form.title,
                    description: form.description,
                    featured: form.featured,
                });
            } else {
                // Must include image for create - use placeholder if no file
                if (!form.image) {
                    // Create without image by sending JSON with a placeholder
                    await api.post('/admin/portfolios', data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    await api.post('/admin/portfolios', data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
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

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Portfolio</h1>
                <button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolios.map(p => (
                    <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="h-40 bg-gradient-to-br from-amber-100 to-rose-50 flex items-center justify-center relative">
                            <Camera className="h-10 w-10 text-amber-300" />
                            {p.featured && (
                                <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>
                            )}
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-gray-400">{p.category?.name}</p>
                            <h3 className="font-medium text-gray-900 text-sm">{p.title}</h3>
                            <div className="flex gap-1 mt-2">
                                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded"><Pencil className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {portfolios.length === 0 && (
                <div className="text-center py-20 text-gray-400"><Camera className="h-16 w-16 mx-auto mb-4 opacity-50" /><p>No portfolio items yet.</p></div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">Select</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            {!editing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm" />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} id="featured" className="rounded border-gray-300" />
                                <label htmlFor="featured" className="text-sm text-gray-700">Featured</label>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={saving} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50">
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
