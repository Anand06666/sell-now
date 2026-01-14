import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Truck, Clock, MapPin } from 'lucide-react';

export default function ShippingInfo() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Information</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
                            <Truck size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                        <p className="text-sm text-gray-600 mt-2">Delivery within 3-5 business days across major cities.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <Clock size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900">Real-time Tracking</h3>
                        <p className="text-sm text-gray-600 mt-2">Track your order status step-by-step in the app.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900">Pan-India Service</h3>
                        <p className="text-sm text-gray-600 mt-2">We deliver to 19,000+ pin codes across India.</p>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm space-y-6 text-gray-700 leading-relaxed">
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Costs</h2>
                    <p>
                        We offer <strong>Free Shipping</strong> on most orders above ₹500. For orders below this amount, a standard shipping fee of ₹40 applies.
                        Expedited shipping options may be available at checkout for select locations.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">Delivery Timelines</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Metro Cities:</strong> 2-4 business days</li>
                        <li><strong>Rest of India:</strong> 4-7 business days</li>
                        <li><strong>Remote Areas:</strong> 7+ business days</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">Delays</h2>
                    <p>
                        While we strive to deliver on time, unforeseen circumstances like bad weather, strikes, or transport delays may impact delivery.
                        We will keep you updated via SMS/Email in such cases.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
