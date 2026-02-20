import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Plus, Pencil, Trash2, X, Grid3x3 } from 'lucide-react';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadCategories(); }, []);

    const loadCategories = () => {
        api.get('/categories')
            .then(r => setCategories(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', description: '' });
        setShowForm(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, description: c.description || '' });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('name', form.name);
            data.append('description', form.description);
            if (form.image) data.append('image', form.image);

            if (editing) {
                await api.put(`/admin/categories/${editing.id}`, {
                    name: form.name,
                    description: form.description,
                });
            } else {
                await api.post('/admin/categories', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowForm(false);
            loadCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category? All related services and portfolios may be affected.')) return;
        try { await api.delete(`/admin/categories/${id}`); loadCategories(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
                <button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <Grid3x3 className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                                    <p className="text-xs text-gray-400">/{c.slug}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded"><Pencil className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                        {c.description && <p className="text-sm text-gray-500 mt-3">{c.description}</p>}
                        <div className="flex gap-3 mt-3 text-xs text-gray-400">
                            <span>{c.services_count || c.services?.length || 0} services</span>
                            <span>{c.portfolios_count || c.portfolios?.length || 0} portfolios</span>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-20 text-gray-400"><Grid3x3 className="h-16 w-16 mx-auto mb-4 opacity-50" /><p>No categories yet.</p></div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Portrait Photography" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500" placeholder="Brief description..." />
                            </div>
                            {!editing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                                    <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm" />
                                </div>
                            )}
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
