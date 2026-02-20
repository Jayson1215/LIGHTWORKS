import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Calendar, Camera, FolderOpen, Users, CreditCard,
    Menu, X, LogOut, Home, Layers, ChevronRight, Bell
} from 'lucide-react';

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/services', icon: Camera, label: 'Services' },
    { path: '/admin/categories', icon: Layers, label: 'Categories' },
    { path: '/admin/portfolios', icon: FolderOpen, label: 'Portfolio' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const currentPage = navItems.find(item => isActive(item))?.label || 'Dashboard';

    return (
        <div className="min-h-screen flex bg-gray-50/80">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Brand */}
                <div className="p-6 pb-4">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Camera className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg tracking-tight block leading-none">LIGHT</span>
                            <span className="text-amber-400/70 text-[10px] font-medium uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-5 right-4 text-gray-500 hover:text-white transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-4 space-y-1 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-2">Menu</p>
                    {navItems.map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative ${
                                    active
                                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
                                )}
                                <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-amber-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                    <item.icon className={`h-4 w-4 ${active ? 'text-amber-400' : ''}`} />
                                </div>
                                {item.label}
                                {active && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-medium">
                            <Home className="h-3.5 w-3.5" /> View Site
                        </Link>
                        <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs font-medium">
                            <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900 transition">
                            <Menu className="h-6 w-6" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-none">{currentPage}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
