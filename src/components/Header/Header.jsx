import React, { useState } from 'react'
import { Container, LogoutBtn } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X } from 'lucide-react'

export default function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)

    const navItems = [
        { name: 'Home', slug: '/' },
        { name: 'Login', slug: '/login', auth: false },
        { name: 'Signup', slug: '/signup', auth: false },
        { name: 'All Posts', slug: '/all-posts', auth: true },
        { name: 'Add Post', slug: '/add-post', auth: true },
    ]

    return (
        <header className=" top-0 w-full backdrop-blur-sm bg-white/50 z-50 border-b border-gray-200">
            <Container>
                <div className="flex items-center justify-between py-3">
                    {/* Logo */}
                    <Link to="/" className="text-3xl font-extrabold tracking-tight text-gray-900 hover:text-blue-600 transition">
                        Narrativ
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex gap-6 items-center">
                        {navItems.map(({ name, slug, auth }) => {
                            if (auth === undefined || auth === authStatus) {
                                const active = location.pathname === slug
                                return (
                                    <button
                                        key={name}
                                        onClick={() => navigate(slug)}
                                        className={`relative px-2 py-1 font-medium transition 
                        ${active
                                                ? 'text-blue-600'
                                                : 'text-gray-700 hover:text-blue-500'}`
                                        }
                                    >
                                        {name}
                                        <span
                                            className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform 
                        ${active ? 'scale-x-100' : 'scale-x-0'} transition-transform origin-left`}
                                        />
                                    </button>
                                )
                            }
                            return null
                        })}
                        {authStatus && <LogoutBtn />}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-gray-900"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile nav drawer */}
                {open && (
                    <nav className="md:hidden flex flex-col gap-4 pb-4">
                        {navItems.map(({ name, slug, auth }) => {
                            if (auth === undefined || auth === authStatus) {
                                return (
                                    <Link
                                        key={name}
                                        to={slug}
                                        onClick={() => setOpen(false)}
                                        className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        {name}
                                    </Link>
                                )
                            }
                            return null
                        })}
                        {authStatus && (
                            <div className="px-4">
                                <LogoutBtn onClick={() => setOpen(false)} />
                            </div>
                        )}
                    </nav>
                )}
            </Container>
        </header>
    )
}
