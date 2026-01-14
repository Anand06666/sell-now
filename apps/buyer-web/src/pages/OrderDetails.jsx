
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import { Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.put(`/orders/${id}/cancel`, { reason: 'Cancelled by user' });
            fetchOrder();
        } catch (error) {
            alert('Failed to cancel order');
        }
    };

    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [returnLoading, setReturnLoading] = useState(false);

    const handleReturn = async (e) => {
        e.preventDefault();
        setReturnLoading(true);
        try {
            await api.post(`/orders/${id}/return`, { reason: returnReason });
            setShowReturnModal(false);
            fetchOrder();
            alert('Return request submitted successfully');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to request return');
        } finally {
            setReturnLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!order) return <div className="text-center py-20">Order not found</div>;

    const steps = [
        { status: 'pending', label: 'Order Placed', icon: Clock },
        { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
        { status: 'delivered', label: 'Delivered', icon: Package },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.orderStatus);
    const isCancelled = order.orderStatus === 'cancelled';
    const isReturning = order.returnRequest?.isRequested;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link to="/orders" className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-1" /> Back to Orders
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber || order._id.slice(-6)}</h1>
                            <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0">
                            {order.orderStatus === 'pending' && (
                                <button onClick={handleCancel} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
                                    Cancel Order
                                </button>
                            )}
                            {order.orderStatus === 'delivered' && !isReturning && (
                                <button
                                    onClick={() => setShowReturnModal(true)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
                                >
                                    Return / Replace
                                </button>
                            )}
                            {isReturning && (
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${order.returnRequest.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                    order.returnRequest.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}>
                                    {order.returnRequest.status === 'approved' ? 'Return Approved' :
                                        order.returnRequest.status === 'rejected' ? 'Return Rejected' :
                                            'Return Requested'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Tracker */}
                    <div className="p-8 bg-gray-50/50">
                        {isCancelled ? (
                            <div className="flex items-center text-red-600 font-bold bg-red-50 p-4 rounded-xl">
                                <XCircle size={24} className="mr-3" />
                                <div>
                                    <div>Order Cancelled</div>
                                    <div className="text-xs font-normal opacity-75">{new Date(order.updatedAt).toLocaleString()}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Progress Bar Background */}
                                <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                                {/* Progress Bar Fill */}
                                <div
                                    className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.max(0, currentStepIndex / (steps.length - 1) * 100)}%` }}
                                ></div>

                                <div className="relative flex justify-between">
                                    {steps.map((step, idx) => {
                                        const Icon = step.icon;
                                        const isActive = idx <= currentStepIndex;
                                        return (
                                            <div key={step.status} className="flex flex-col items-center">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 transition-all ${isActive ? 'bg-primary border-white shadow-lg text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                                    <Icon size={16} />
                                                </div>
                                                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px bg-gray-100">

                        {/* Return Status Section */}
                        {isReturning && (
                            <div className="bg-white p-6 border-b border-gray-100">
                                <div className={`p-4 rounded-xl border ${order.returnRequest.status === 'approved' ? 'bg-green-50 border-green-200' :
                                    order.returnRequest.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                        'bg-yellow-50 border-yellow-200'
                                    }`}>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {order.returnRequest.status === 'approved' ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : order.returnRequest.status === 'rejected' ? (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                            )}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <h3 className={`text-sm font-bold ${order.returnRequest.status === 'approved' ? 'text-green-800' :
                                                order.returnRequest.status === 'rejected' ? 'text-red-800' :
                                                    'text-yellow-800'
                                                }`}>
                                                Return Request {order.returnRequest.status}
                                            </h3>
                                            <div className={`mt-2 text-sm ${order.returnRequest.status === 'approved' ? 'text-green-700' :
                                                order.returnRequest.status === 'rejected' ? 'text-red-700' :
                                                    'text-yellow-700'
                                                }`}>
                                                <p><span className="font-semibold">Reason:</span> {order.returnRequest.reason}</p>
                                                {order.returnRequest.rejectionReason && (
                                                    <p className="mt-1"><span className="font-semibold">Rejection Reason:</span> {order.returnRequest.rejectionReason}</p>
                                                )}

                                                {/* Pickup Status Tracking */}
                                                {order.returnRequest.status === 'approved' && (
                                                    <div className="mt-3 pt-3 border-t border-green-200">
                                                        <p className="font-semibold text-green-800 mb-1">Return Status:</p>
                                                        {order.returnRequest.pickupStatus ? (
                                                            <>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className={`h-2 w-2 rounded-full ${['scheduled', 'out_for_pickup', 'picked_up', 'received_by_seller', 'returned'].includes(order.returnRequest.pickupStatus) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                                                    <span className="capitalize font-medium text-green-900">
                                                                        {order.returnRequest.pickupStatus.replace(/_/g, ' ')}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs mt-1 opacity-80">
                                                                    {order.returnRequest.pickupStatus === 'scheduled' && 'Pickup has been scheduled.'}
                                                                    {order.returnRequest.pickupStatus === 'out_for_pickup' && 'Executive is out for pickup.'}
                                                                    {order.returnRequest.pickupStatus === 'picked_up' && 'Item picked up from your address.'}
                                                                    {order.returnRequest.pickupStatus === 'received_by_seller' && 'Item received by seller. Refund/Replacement processed.'}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-green-800">
                                                                Your return request has been approved. The seller will schedule a pickup shortly.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="mt-2 text-xs opacity-75">Requested on: {new Date(order.returnRequest.requestedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items - Spans 2 cols */}
                        <div className="md:col-span-2 bg-white p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Items</h2>
                            <div className="space-y-6">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt=""
                                            className="w-20 h-24 object-cover rounded-lg border border-gray-100"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{item.title}</div>
                                            <div className="text-sm text-gray-500 mt-1">Size: {item.size || 'N/A'} • Qty: {item.quantity}</div>
                                            <div className="text-primary font-bold mt-2">₹{item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white p-6 space-y-8">

                            {/* Address */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                    <MapPin size={16} className="mr-2" /> Delivery Address
                                </h3>
                                <div className="text-sm text-gray-700">
                                    <div className="font-bold text-gray-900 mb-1">{order.deliveryAddress?.name}</div>
                                    <p>{order.deliveryAddress?.addressLine1}</p>
                                    <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                                    <p className="mt-2 text-gray-500">Phone: {order.deliveryAddress?.phone}</p>
                                </div>
                            </div>

                            {/* Payment */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                    <CreditCard size={16} className="mr-2" /> Payment Info
                                </h3>
                                <div className="text-sm text-gray-700">
                                    <div className="flex justify-between mb-1">
                                        <span>Method</span>
                                        <span className="font-medium capitalize">{order.paymentMethod?.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status</span>
                                        <span className={`font-bold capitalize ${order.paymentMethod?.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {order.paymentMethod?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{order.pricing.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span>₹{order.pricing.deliveryCharge}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-50 mt-2">
                                        <span>Total</span>
                                        <span>₹{order.pricing.total}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Return Modal */}
                {showReturnModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Return / Replacement</h2>
                            <form onSubmit={handleReturn}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Return</label>
                                    <textarea
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        rows="4"
                                        placeholder="Please explain why you want to return or replace this item..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowReturnModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={returnLoading}
                                        className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70"
                                    >
                                        {returnLoading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
