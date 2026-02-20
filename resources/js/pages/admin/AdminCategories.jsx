import React, { useEffect, useState } from 'react';
import api from '../../api';
import { getImageSrc } from '../../utils/imageHelpers';
import { Plus, Pencil, Trash2, X, Grid3x3, Camera, FolderOpen, Hash } from 'lucide-react';

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
                const editData = new FormData();
                editData.append('name', form.name);
                editData.append('description', form.description);
                if (form.image) editData.append('image', form.image);
                editData.append('_method', 'PUT');
                await api.post(`/admin/categories/${editing.id}`, editData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
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

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-amber-500 mx-auto" />
                <p className="text-sm text-gray-400 mt-4">Loading categories...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{categories.length} categories</p>
                </div>
                <button onClick={openCreate} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((c, i) => (
                    <div key={c.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-0.5">
                        {/* Category Image Banner */}
                        <div className="h-28 relative overflow-hidden">
                            <img src={getImageSrc(c, 'categories', i)} alt={c.name} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent`} />
                        </div>

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                                    <p className="text-xs text-gray-400 font-mono">/{c.slug}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {c.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{c.description}</p>}

                            <div className="flex gap-3">
                                <div className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg">
                                    <Camera className="h-3.5 w-3.5" />
                                    <span className="font-semibold">{c.services_count || c.services?.length || 0}</span>
                                    <span className="text-blue-400">services</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm bg-violet-50 text-violet-600 px-3 py-1.5 rounded-lg">
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    <span className="font-semibold">{c.portfolios_count || c.portfolios?.length || 0}</span>
                                    <span className="text-violet-400">portfolios</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                        <Grid3x3 className="h-10 w-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No categories yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first category to organize services</p>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Category' : 'New Category'}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update category details' : 'Organize your photography services'}</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="e.g. Portrait Photography" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="Brief description of this category..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{editing ? 'Change Image (optional)' : 'Image (optional)'}</label>
                                {editing?.image && !form.image && (
                                    <div className="mb-2 rounded-xl overflow-hidden h-24 bg-gray-50">
                                        <img src={getImageSrc(editing, 'categories', 0)} alt="Current" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-amber-50 file:text-amber-600 file:text-sm file:font-medium" />
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
