import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from 'lucide-react';

function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = () => {
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-black text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Brand & About Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-bold mb-4 text-white">YourBlog</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Discover inspiring stories, expert insights, and the latest trends. 
                            Join our community of passionate readers and writers.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">All Articles</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Categories</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Write for Us</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Technology</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Lifestyle</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Travel</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Health & Wellness</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Business</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Food & Recipe</a></li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Stay Connected</h4>
                        
                        {/* Newsletter Signup */}
                        <div className="mb-6">
                            <p className="text-gray-300 mb-3">Subscribe to our newsletter</p>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
                                />
                                <button
                                    onClick={handleNewsletterSubmit}
                                    className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                                >
                                    <Send size={16} />
                                    <span>Subscribe</span>
                                </button>
                            </div>
                            {subscribed && (
                                <p className="text-green-400 text-sm mt-2">✓ Successfully subscribed!</p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Mail size={16} />
                                <span>hello@yourblog.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Phone size={16} />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <MapPin size={16} />
                                <span>New York, NY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © 2025 YourBlog. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Cookie Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;