
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import { Package, ChevronRight, Clock, CheckCircle } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-500 mb-6">Looking for products to buy?</p>
                        <div className="text-xs text-gray-400 mb-4">
                            Logged in as: {JSON.parse(localStorage.getItem('userInfo'))?.email}
                        </div>
                        <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link to={`/order/${order._id}`} key={order._id} className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <Package size={20} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">Order #{order.orderNumber || order._id.slice(-6)}</div>
                                                <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.orderStatus.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="flex items-center space-x-4">
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt=""
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                                                    <div className="text-sm text-gray-500">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && <div className="text-xs text-gray-500 pl-20">+ {order.items.length - 2} more items</div>}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Total Amount: </span>
                                            <span className="font-bold text-gray-900">₹{order.pricing.total}</span>
                                        </div>
                                        <div className="text-primary text-sm font-semibold flex items-center">
                                            View Details <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
