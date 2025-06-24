import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

const Footer = () => {
    return (
        <footer className="bg-white text-black mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Logo & Description */}
                    <div className="space-y-4">
                        <h3 className="text-2xl  tracking-tight">
                            <span className="font-extralight">Narrativ</span>
                        </h3>
                        <p className="text-slate-700  leading-relaxed ">
                            Where stories come alive and voices echo across the digital realm. 
                            Share your narrative with the world.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Quick Links</h4>
                        <div className="flex flex-col space-y-2">
                            {['Home', 'All Posts', 'About', 'Contact'].map((link) => (
                                <button
                                    key={link}
                                    className=" hover:text-black transition-colors text-left w-fit "
                                    onClick={() => alert(`Navigate to ${link}`)}
                                >
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Connect</h4>
                        <div className="text-gray-800  space-y-2">
                            <p>Built with passion by</p>
                            <p className="text-white font-medium">@Tushar</p>
                            <div className="flex items-center gap-2 pt-2">
                                <span>Made with</span>
                                <span className="text-red-400 animate-pulse">❤️</span>
                                <span>for storytellers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-800 text-sm ">
                        © 2024 Narrativ. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        {['Privacy', 'Terms', 'Support'].map((item) => (
                            <button
                                key={item}
                                className=" text-black transition-colors "
                                onClick={() => alert(`Navigate to ${item}`)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer