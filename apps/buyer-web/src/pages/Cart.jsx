import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import { Trash2, Minus, Plus, CreditCard, ArrowRight } from 'lucide-react';

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const { data } = await api.get('/cart');
            setCart(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load cart", error);
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, size, newQty) => {
        if (newQty < 1) return;
        try {
            await api.put(`/cart/${productId}`, { quantity: newQty, size });
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Update quantity failed", error);
        }
    };

    const removeItem = async (productId, size) => {
        try {
            // Backend expects size as query param for delete
            await api.delete(`/cart/${productId}?size=${encodeURIComponent(size || '')}`);
            fetchCart();
        } catch (error) {
            console.error("Remove item failed", error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-48 h-48 opacity-50 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                    <Link to="/" className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate totals assuming backend returns them, if not re-calculate
    // Backend cart schema typically has detailed item info
    const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const delivery = 40; // Static for now or logic
    const total = subtotal + delivery;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden p-6 border border-gray-100">
                        <div className="space-y-6">
                            {cart.items.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={getImageUrl(item.image || item.product?.images?.[0])}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">{item.title || item.product?.title}</h3>
                                                {item.size && <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>}
                                                <div className="mt-2 font-bold text-primary">₹{item.price}</div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product?._id || item.product, item.size)}
                                                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.product?._id || item.product, item.size, item.quantity - 1)}
                                                    className="p-1 px-3 text-gray-500 hover:text-primary cursor-pointer"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product?._id || item.product, item.size, item.quantity + 1)}
                                                    className="p-1 px-3 text-gray-500 hover:text-primary cursor-pointer"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>₹{delivery}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 text-lg pt-4 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-primary">₹{total}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={18} />
                            </Link>

                            <div className="mt-4 flex items-center justify-center space-x-2 text-gray-400">
                                <CreditCard size={16} />
                                <span className="text-xs">Secure Checkout Powered by Razorpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
