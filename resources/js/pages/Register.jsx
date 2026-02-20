import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Eye, EyeOff, CheckCircle, X } from 'lucide-react';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form);
            setShowSuccess(true);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: [err.response?.data?.message || 'Registration failed'] });
            }
        } finally {
            setLoading(false);
        }
    };

    const update = (field, value) => setForm({ ...form, [field]: value });

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => { setShowSuccess(false); navigate('/login'); }}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-[fadeIn_0.3s_ease]" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => { setShowSuccess(false); navigate('/login'); }}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
                        <p className="text-gray-500 text-sm mb-6">Your account has been successfully created. Please sign in with your credentials to continue.</p>
                        <button
                            onClick={() => { setShowSuccess(false); navigate('/login'); }}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition"
                        >
                            Go to Sign In
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Camera className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-1">Join us to book photography sessions</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                    {errors.general && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{errors.general[0]}</div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text" required value={form.name}
                            onChange={e => update('name', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                            placeholder="Juan Dela Cruz"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" required value={form.email}
                            onChange={e => update('email', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                        <input
                            type="text" value={form.phone}
                            onChange={e => update('phone', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                            placeholder="09XX XXX XXXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'} required value={form.password}
                                onChange={e => update('password', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password" required value={form.password_confirmation}
                            onChange={e => update('password_confirmation', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
