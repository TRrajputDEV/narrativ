import React, { useState, useEffect } from 'react'
import { Container, LogoutBtn } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X, Home, FileText, PlusSquare, LogIn, UserPlus, ChevronRight } from 'lucide-react'

export default function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Close sidebar on route change
    useEffect(() => setSidebarOpen(false), [location])

    const navItems = [
        { name: 'Home', slug: '/', icon: <Home size={20} /> },
        { name: 'Login', slug: '/login', auth: false, icon: <LogIn size={20} /> },
        { name: 'Signup', slug: '/signup', auth: false, icon: <UserPlus size={20} /> },
        { name: 'All Posts', slug: '/all-posts', auth: true, icon: <FileText size={20} /> },
        { name: 'Add Post', slug: '/add-post', auth: true, icon: <PlusSquare size={20} /> },
    ]

    return (
        <>
            {/* Top Header Bar - Mobile Only */}
            <header className="md:hidden fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-lg">N</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">
                            Narrativ
                        </span>
                    </Link>
                    
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex-col z-40">
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-50">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                            <span className="font-bold text-white text-xl">N</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">
                                Narrativ
                            </span>
                            <p className="text-xs text-gray-500 -mt-1">Premium Writing</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(({ name, slug, auth, icon }) => {
                        if (auth === undefined || auth === authStatus) {
                            const active = location.pathname === slug
                            return (
                                <button
                                    key={slug}
                                    onClick={() => navigate(slug)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                                        ${active 
                                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 shadow-sm border border-emerald-100' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span className={`transition-colors ${active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                        {icon}
                                    </span>
                                    <span className="flex-1 text-left">{name}</span>
                                    {active && <ChevronRight size={16} className="text-emerald-500" />}
                                </button>
                            )
                        }
                        return null
                    })}
                </nav>

                {/* User Section */}
                {authStatus && (
                    <div className="p-4 border-t border-gray-50">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-green-50 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                                {userData?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{userData?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">Premium Member</p>
                            </div>
                        </div>
                        <LogoutBtn className="w-full justify-center bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300" />
                    </div>
                )}
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`md:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Mobile Logo */}
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="font-bold text-white text-xl">N</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">
                                Narrativ
                            </span>
                            <p className="text-xs text-gray-500 -mt-1">Premium Writing</p>
                        </div>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(({ name, slug, auth, icon }) => {
                        if (auth === undefined || auth === authStatus) {
                            const active = location.pathname === slug
                            return (
                                <button
                                    key={slug}
                                    onClick={() => { navigate(slug); setSidebarOpen(false); }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                        ${active 
                                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 shadow-sm border border-emerald-100' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span className={`transition-colors ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {icon}
                                    </span>
                                    <span className="flex-1 text-left">{name}</span>
                                    {active && <ChevronRight size={16} className="text-emerald-500" />}
                                </button>
                            )
                        }
                        return null
                    })}
                </nav>

                {/* Mobile User Section */}
                {authStatus && (
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-green-50 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                                {userData?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{userData?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">Premium Member</p>
                            </div>
                        </div>
                        <LogoutBtn 
                            className="w-full justify-center bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300"
                            onClick={() => setSidebarOpen(false)} 
                        />
                    </div>
                )}
            </aside>
        </>
    )
}