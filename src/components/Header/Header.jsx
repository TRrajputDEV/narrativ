import React, { useState, useEffect } from 'react'
import { Container, LogoutBtn } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X, Home, FileText, PlusSquare, LogIn, UserPlus } from 'lucide-react'

export default function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Close mobile menu when route changes
    useEffect(() => {
        setOpen(false)
    }, [location])

    // Add scroll effect to header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { name: 'Home', slug: '/', icon: <Home size={16} /> },
        { name: 'Login', slug: '/login', auth: false, icon: <LogIn size={16} /> },
        { name: 'Signup', slug: '/signup', auth: false, icon: <UserPlus size={16} /> },
        { name: 'All Posts', slug: '/all-posts', auth: true, icon: <FileText size={16} /> },
        { name: 'Add Post', slug: '/add-post', auth: true, icon: <PlusSquare size={16} /> },
    ]

    return (
        <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'} border-b border-gray-100`}>
            <Container>
                <div className="flex items-center justify-between py-3">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 group"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-800 transition-all">
                            Narrativ
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map(({ name, slug, auth, icon }) => {
                            if (auth === undefined || auth === authStatus) {
                                const active = location.pathname === slug
                                return (
                                    <button
                                        key={name}
                                        onClick={() => navigate(slug)}
                                        className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                                            ${active
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className={`transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {icon}
                                        </span>
                                        {name}
                                    </button>
                                )
                            }
                            return null
                        })}
                        {authStatus && (
                            <div className="ml-2">
                                <LogoutBtn />
                            </div>
                        )}
                    </nav>

                    {/* User profile */}
                    {authStatus && (
                        <div className="hidden md:flex items-center">
                            <Link 
                                to="/" 
                                className="flex items-center gap-2 group ml-4"
                            >
                                {/* <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" /> */}
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                    {userData?.name || 'Profile'}
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        onClick={() => setOpen(!open)}
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile nav */}
                {open && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />
                        
                        {/* Menu panel */}
                        <div className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300">
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <Link 
                                    to="/" 
                                    className="flex items-center gap-2"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-7 h-7 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">N</span>
                                    </div>
                                    <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                        Narrativ
                                    </span>
                                </Link>
                                <button 
                                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                                    onClick={() => setOpen(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <nav className="py-4">
                                {navItems.map(({ name, slug, auth, icon }) => {
                                    if (auth === undefined || auth === authStatus) {
                                        const active = location.pathname === slug
                                        return (
                                            <Link
                                                key={name}
                                                to={slug}
                                                onClick={() => setOpen(false)}
                                                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors
                                                    ${active
                                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className={`${active ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    {icon}
                                                </span>
                                                {name}
                                            </Link>
                                        )
                                    }
                                    return null
                                })}
                                
                                {authStatus && (
                                    <div className="px-5 py-3.5">
                                        <LogoutBtn 
                                            className="w-full justify-center"
                                            onClick={() => setOpen(false)}
                                        />
                                    </div>
                                )}
                                
                                {authStatus && (
                                    <Link
                                        to="/"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 mt-2 border-t border-gray-100"
                                    >
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                                        <div>
                                            <div className="font-medium">{userData?.name || 'Your Profile'}</div>
                                            <div className="text-xs text-gray-500">View profile</div>
                                        </div>
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                )}
            </Container>
        </header>
    )
}