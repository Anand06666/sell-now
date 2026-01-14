import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function Support() {
    return (
        <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Help & Support</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Mail size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-sm text-gray-500 mb-4">Get help via email. We usually respond within 24 hours.</p>
                    <a href="mailto:support@sellnow.com" className="text-primary font-medium hover:underline">support@sellnow.com</a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Phone size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
                    <p className="text-sm text-gray-500 mb-4">Call us directly for immediate assistance.</p>
                    <a href="tel:+919014081760" className="text-blue-600 font-medium hover:underline">+91 90140 81760</a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-500 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">WhatsApp Support</h3>
                    <p className="text-sm text-gray-500 mb-4">Chat with us on WhatsApp for quick queries.</p>
                    <a href="https://wa.me/919014081760" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">+91 90140 81760</a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <MessageSquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Frequently Asked Questions</h3>
                            <div className="mt-4 space-y-4">
                                <details className="group border-b border-gray-100 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-primary">
                                        <span>How do I track my order?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 mt-3 text-sm group-open:animate-fadeIn">
                                        Go to 'My Orders' section in your profile to view the status of all your orders.
                                    </p>
                                </details>
                                <details className="group border-b border-gray-100 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-primary">
                                        <span>What is the return policy?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 mt-3 text-sm group-open:animate-fadeIn">
                                        You can return most items within 7 days of delivery. Check the product page for specific return policies.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
