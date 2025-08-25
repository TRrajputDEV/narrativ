import React, { useState, useEffect } from 'react'
import { Container, LogoutBtn } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X, Home, FileText, PlusSquare, LogIn, UserPlus, ChevronRight, ExternalLink } from 'lucide-react'

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
            <header className="md:hidden fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <span className="font-black text-black text-lg doto-bold">P</span>
                        </div>
                        <span className="text-xl font-black text-white doto-heading">
                            Narrativ
                        </span>
                    </Link>
                    
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl bg-card hover:bg-muted transition-colors"
                        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                    >
                        {sidebarOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
                    </button>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-background border-r border-border flex-col z-40">
                {/* Logo Section */}
                <div className="p-6 border-b border-border/50">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-white/20 transition-shadow duration-200">
                            <span className="font-black text-black text-xl doto-bold">P</span>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white doto-heading">
                                Narrativ
                            </span>
                            <p className="text-xs text-muted-foreground -mt-1">Writing's Platform</p>
                        </div>
                    </Link>
                    
                    {/* Website Link */}
                    <div className="mt-4">
                        <a 
                            href="https://watchpixels.onrender.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors group"
                        >
                            <ExternalLink size={12} />
                            <span>Check out Pixels</span>
                        </a>
                    </div>
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
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group doto-button
                                        ${active 
                                            ? 'bg-white/10 text-white shadow-sm border border-white/20' 
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <span className={`transition-colors ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                        {icon}
                                    </span>
                                    <span className="flex-1 text-left">{name}</span>
                                    {active && <ChevronRight size={16} className="text-white" />}
                                </button>
                            )
                        }
                        return null
                    })}
                </nav>

                {/* User Section */}
                {authStatus && (
                    <div className="p-4 border-t border-border/50">
                        <div className="flex items-center space-x-3 p-3 rounded-xl glass-effect mb-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black doto-bold shadow-sm">
                                {userData?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground truncate doto-button">{userData?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">Premium Member</p>
                            </div>
                        </div>
                        <LogoutBtn className="w-full justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 doto-button" />
                    </div>
                )}
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`md:hidden fixed left-0 top-0 h-full w-80 bg-background shadow-2xl transform transition-transform duration-300 ease-out z-50
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Mobile Logo */}
                <div className="p-6 border-b border-border">
                    <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="font-black text-black text-xl doto-bold">P</span>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white doto-heading">
                                Narrativ
                            </span>
                            <p className="text-xs text-muted-foreground -mt-1">Writing's Platform</p>
                        </div>
                    </Link>
                    
                    {/* Mobile Website Link */}
                    <div className="mt-4">
                        <a 
                            href="https://watchpixels.onrender.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <ExternalLink size={12} />
                            <span>Visit our website</span>
                        </a>
                    </div>
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
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 doto-button
                                        ${active 
                                            ? 'bg-white/10 text-white shadow-sm border border-white/20' 
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <span className={`transition-colors ${active ? 'text-white' : 'text-muted-foreground'}`}>
                                        {icon}
                                    </span>
                                    <span className="flex-1 text-left">{name}</span>
                                    {active && <ChevronRight size={16} className="text-white" />}
                                </button>
                            )
                        }
                        return null
                    })}
                </nav>

                {/* Mobile User Section */}
                {authStatus && (
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center space-x-3 p-3 rounded-xl glass-effect mb-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black doto-bold shadow-sm">
                                {userData?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground doto-button">{userData?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">Premium Member</p>
                            </div>
                        </div>
                        <LogoutBtn 
                            className="w-full justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 doto-button"
                            onClick={() => setSidebarOpen(false)} 
                        />
                    </div>
                )}
            </aside>
        </>
    )
}
