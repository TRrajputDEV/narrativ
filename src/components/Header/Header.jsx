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

    // Close mobile menu on route change
    useEffect(() => setOpen(false), [location])

    // Add shadow on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navItems = [
        { name: 'Home', slug: '/', icon: <Home size={16} /> },
        { name: 'Login', slug: '/login', auth: false, icon: <LogIn size={16} /> },
        { name: 'Signup', slug: '/signup', auth: false, icon: <UserPlus size={16} /> },
        { name: 'All Posts', slug: '/all-posts', auth: true, icon: <FileText size={16} /> },
        { name: 'Add Post', slug: '/add-post', auth: true, icon: <PlusSquare size={16} /> },
    ]

    return (
        <header className={`fixed top-0 w-full z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-none'}`}>
            <Container>
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white text-lg">N</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                            Narrativ
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        {navItems.map(({ name, slug, auth, icon }) => {
                            if (auth === undefined || auth === authStatus) {
                                const active = location.pathname === slug
                                return (
                                    <button
                                        key={slug}
                                        onClick={() => navigate(slug)}
                                        className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ease-in-out 
                        ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <span className={`${active ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
                                        <span>{name}</span>
                                    </button>
                                )
                            }
                            return null
                        })}
                        {authStatus && <LogoutBtn className="ml-2" />}
                        {authStatus && (
                            <Link to="/" className="ml-4 text-gray-700 hover:text-blue-600 font-medium">
                                {userData?.name || 'Profile'}
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Toggle Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 rounded-md focus:outline-none focus:ring"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </Container>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out 
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <Link to="/" onClick={() => setOpen(false)} className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-700 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                            Narrativ
                        </span>
                    </Link>
                    <button onClick={() => setOpen(false)} className="p-2 rounded-md focus:outline-none focus:ring">
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-1">
                    {navItems.map(({ name, slug, auth, icon }) => {
                        if (auth === undefined || auth === authStatus) {
                            const active = location.pathname === slug
                            return (
                                <button
                                    key={slug}
                                    onClick={() => { navigate(slug); setOpen(false); }}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ease-in-out w-full text-left 
                    ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <span className={`${active ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
                                    <span>{name}</span>
                                </button>
                            )
                        }
                        return null
                    })}
                    {authStatus && (
                        <>
                            <LogoutBtn className="mt-2 w-full justify-center" onClick={() => setOpen(false)} />
                            <Link
                                to="/"
                                onClick={() => setOpen(false)}
                                className="flex items-center space-x-3 px-3 py-2 mt-4 border-t pt-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                                    {userData?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium">{userData?.name || 'Your Profile'}</p>
                                    <p className="text-xs text-gray-500">View profile</p>
                                </div>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
