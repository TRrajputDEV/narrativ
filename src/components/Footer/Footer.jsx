import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-gray-50 to-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-5">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">N</span>
                            </div>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-800 transition-all">
                                Narrativ
                            </span>
                        </Link>
                        <p className="text-gray-600 leading-relaxed">
                            Where stories come alive and voices echo across the digital realm. 
                            Share your narrative with the world.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {[
                                { name: 'Twitter', icon: (
                                    <svg className="w-5 h-5 text-gray-600 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                    </svg>
                                )},
                                { name: 'Instagram', icon: (
                                    <svg className="w-5 h-5 text-gray-600 hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                                    </svg>
                                )},
                                { name: 'GitHub', icon: (
                                    <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                                    </svg>
                                )}
                            ].map((social) => (
                                <a 
                                    key={social.name}
                                    href="#" 
                                    aria-label={`Follow us on ${social.name}`}
                                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-5">
                        <h4 className="text-lg font-semibold text-gray-800">Explore</h4>
                        <div className="flex flex-col space-y-3">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'All Posts', path: '/all-posts' },
                                { name: 'My Stories', path: '/my-posts' },
                                { name: 'Top Stories', path: '/top-posts' }
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-600 hover:text-blue-600 transition-colors w-fit"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-5">
                        <h4 className="text-lg font-semibold text-gray-800">Resources</h4>
                        <div className="flex flex-col space-y-3">
                            {['Blog', 'Documentation', 'Community', 'Help Center'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-gray-600 hover:text-blue-600 transition-colors w-fit"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-5">
                        <h4 className="text-lg font-semibold text-gray-800">Connect</h4>
                        <div className="text-gray-600 space-y-3">
                            <p>Built with passion by</p>
                            <a href="#" className="font-medium text-blue-600 hover:underline">Tushar</a>
                            <div className="flex items-center gap-2 pt-2">
                                <span>Made with</span>
                                <span className="text-red-500 animate-pulse">❤️</span>
                                <span>for storytellers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Narrativ. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer