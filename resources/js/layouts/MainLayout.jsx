import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Menu, X, User, LogOut, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    // Navbar scroll effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = async () => {
        setShowLogoutModal(false);
        setMobileOpen(false);
        await logout();
        navigate('/');
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/services', label: 'Services' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 lg:h-18">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2 group">
                                <Camera className="h-8 w-8 text-amber-600 group-hover:rotate-12 transition-transform duration-300" />
                                <div>
                                    <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>LIGHT</span>
                                    <span className="text-xs text-gray-400 hidden sm:block leading-none">Photography Studio</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive(link.to)
                                            ? 'text-amber-600 bg-amber-50'
                                            : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {user ? (
                                <>
                                    <Link
                                        to="/my-bookings"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                                            isActive('/my-bookings')
                                                ? 'text-amber-600 bg-amber-50'
                                                : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Calendar className="h-4 w-4" /> My Bookings
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-all duration-200">
                                            Admin
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-amber-700">{user.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span className="text-sm text-gray-600 hidden lg:block">{user.name}</span>
                                        <button onClick={() => setShowLogoutModal(true)} className="text-gray-400 hover:text-red-500 transition p-1" title="Logout">
                                            <LogOut className="h-4 w-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 transition rounded-lg hover:bg-gray-50">Login</Link>
                                    <Link to="/register" className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition text-sm font-medium shadow-sm shadow-amber-600/20">Sign Up</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            >
                                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                                    isActive(link.to)
                                        ? 'text-amber-600 bg-amber-50'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link to="/my-bookings" className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${isActive('/my-bookings') ? 'text-amber-600 bg-amber-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    My Bookings
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="block px-4 py-3 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50">Admin Panel</Link>
                                )}
                                <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-amber-700">{user.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">{user.name}</span>
                                    </div>
                                    <button onClick={() => setShowLogoutModal(true)} className="text-red-500 text-sm font-medium">Logout</button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-2 mt-2 border-t border-gray-100 space-y-2">
                                <Link to="/login" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 text-center">Login</Link>
                                <Link to="/register" className="block px-4 py-3 rounded-lg text-sm font-medium bg-amber-600 text-white text-center hover:bg-amber-700 transition">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
                    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-[fadeIn_0.2s_ease]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                                <LogOut className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Log Out</h3>
                            <p className="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
                        </div>
                        <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-sm shadow-red-500/20"
                            >
                                Yes, Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="h-7 w-7 text-amber-500" />
                                <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>LIGHT</span>
                            </div>
                            <p className="text-sm leading-relaxed">Capturing moments that last a lifetime. Professional photography services for every occasion.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
                            <div className="space-y-3 text-sm">
                                <Link to="/" className="block hover:text-amber-400 transition">Home</Link>
                                <Link to="/portfolio" className="block hover:text-amber-400 transition">Portfolio</Link>
                                <Link to="/services" className="block hover:text-amber-400 transition">Services</Link>
                                <Link to="/register" className="block hover:text-amber-400 transition">Book Now</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
                            <div className="space-y-3 text-sm">
                                <p>Portrait Photography</p>
                                <p>Wedding Photography</p>
                                <p>Event Coverage</p>
                                <p>Product Photography</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
                            <div className="space-y-3 text-sm">
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-500 shrink-0" /> 123 Photography Lane, Manila</p>
                                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-amber-500 shrink-0" /> info@lightstudio.com</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-500 shrink-0" /> (02) 8123-4567</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-10 pt-8 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} LIGHT Photography Studio. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
