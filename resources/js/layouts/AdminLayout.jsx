import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Calendar, Camera, FolderOpen, Users, CreditCard,
    Menu, X, LogOut, Home, Layers
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

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <Link to="/admin" className="flex items-center gap-2">
                        <Camera className="h-7 w-7 text-amber-500" />
                        <span className="text-white font-bold text-lg">LIGHT Admin</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                                isActive(item)
                                    ? 'bg-amber-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
                        <Home className="h-5 w-5" /> View Site
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition text-sm w-full">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </div>
            </aside>

            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between lg:px-6">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="text-sm text-gray-500">
                        Welcome, <span className="font-medium text-gray-900">{user?.name}</span>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
