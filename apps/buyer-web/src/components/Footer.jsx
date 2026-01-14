import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            {/* <img src="/logo.png" alt="Sell Now" className="h-8 w-auto" /> */}
                            <span className="text-2xl font-bold text-primary">Sell Now</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your one-stop destination for premium products at the best prices.
                            Quality tailored to your lifestyle.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-gray-900 font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-gray-500 hover:text-primary transition-colors">Shop All</Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-gray-500 hover:text-primary transition-colors">My Orders</Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-500 hover:text-primary transition-colors">Cart</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="text-gray-900 font-bold mb-4">Customer Support</h3>
                        <ul className="space-y-3 text-sm">
                            {/* <li>
                                <Link to="/contact" className="text-gray-500 hover:text-primary transition-colors">Contact Us</Link>
                            </li> */}
                            <li>
                                <Link to="/return-policy" className="text-gray-500 hover:text-primary transition-colors">Return Policy</Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-500 hover:text-primary transition-colors">Shipping Info</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-500 hover:text-primary transition-colors">FAQs</Link>
                            </li>
                            <li>
                                <Link to="/customer-policy" className="text-gray-500 hover:text-primary transition-colors">Customer Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-gray-900 font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <MapPin size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-500">Ameenpur, Hyderabad, Telangana, India</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="text-primary mr-2 flex-shrink-0" />
                                <span className="text-gray-500">WhatsApp: +91 90140 81760</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="text-primary mr-2 flex-shrink-0" />
                                <span className="text-gray-500">sellnowhyd@gmail.com</span>
                            </li>
                            <li className="flex items-start">
                                <Clock size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-500">Monday – Saturday<br />9:00 AM – 7:00 PM (IST)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Sell Now. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
