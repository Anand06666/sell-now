
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { MapPin, Plus, CreditCard, Banknote, ShoppingBag, Minus } from 'lucide-react';

const RAZORPAY_KEY = 'rzp_test_YourTestKeyHere'; // Replace with env var in prod

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('online'); // online | cod
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '', phone: '', street: '', city: '', state: '', zip: '', country: 'India', type: 'Home'
    });
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        fetchData();
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const fetchData = async () => {
        try {
            // Check for Direct Buy Item from ProductDetails
            const directItem = location.state?.directBuyItem;

            let cartData = null;
            let addrData = [];

            if (directItem) {
                // Construct a temporary cart structure
                cartData = {
                    items: [{
                        product: directItem.product,
                        quantity: directItem.quantity,
                        size: directItem.size,
                        price: directItem.price,
                        attributes: directItem.attributes
                    }],
                    totalPrice: directItem.price * directItem.quantity
                };
                // Fetch ONLY addresses
                const addrRes = await api.get('/users/address');
                addrData = addrRes.data;
            } else {
                // Normal Cart Flow
                const [cartRes, addrRes] = await Promise.all([
                    api.get('/cart'),
                    api.get('/users/address')
                ]);
                cartData = cartRes.data;
                addrData = addrRes.data;
            }

            console.log("Fetched Addresses:", addrData);
            setCart(cartData);
            setAddresses(addrData);
            if (addrData.length > 0 && !selectedAddress) setSelectedAddress(addrData[0]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load checkout data", error);
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/users/address', newAddress);
            alert('Address Added Successfully!');
            // Refresh addresses only
            const addrRes = await api.get('/users/address');
            setAddresses(addrRes.data);
            if (!selectedAddress) setSelectedAddress(addrRes.data[0]);

            setShowAddressForm(false);
            setNewAddress({ name: '', phone: '', street: '', city: '', state: '', zip: '', country: 'India', type: 'Home' });
        } catch (error) {
            console.error("Address add failed", error);
            const errMsg = error.response?.data?.message || error.message || 'Failed to add address';
            alert(`Error: ${errMsg}`);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        setProcessing(true);

        try {
            // 1. Create Order in Backend 
            const orderPayload = {
                items: cart.items.map(item => ({
                    product: item.product._id || item.product,
                    quantity: item.quantity,
                    size: item.size,
                    attributes: item.attributes, // Pass attributes if needed by backend
                    price: item.price // Pass price for direct buy verification if needed
                })),
                deliveryAddress: selectedAddress,
                paymentMethod: paymentMethod,
                deliveryCharge: 40,
            };

            const { data: order } = await api.post('/orders', orderPayload);

            if (paymentMethod === 'cod') {
                await api.post('/payments/cod', { orderId: order._id });
                alert('Order Placed Successfully!');
                navigate('/orders');
            } else {
                // Razorpay Flow
                // A. Create Razorpay Order
                const { data: payOrder } = await api.post('/payments/create', {
                    amount: order.pricing.total,
                    orderId: order._id
                });

                // B. Open Razorpay Checkout
                const options = {
                    key: RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
                    amount: payOrder.order.amount,
                    currency: payOrder.order.currency,
                    name: "Sell Now",
                    description: "Order Payment",
                    order_id: payOrder.order.id,
                    handler: async function (response) {
                        // C. Verify Payment
                        try {
                            await api.post('/payments/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: order._id
                            });
                            alert('Payment Successful! Order Placed.');
                            navigate('/orders');
                        } catch (err) {
                            alert('Payment Verification Failed');
                        }
                    },
                    prefill: {
                        name: selectedAddress.name,
                        email: "buyer@example.com", // Get from user profile
                        contact: selectedAddress.phone
                    },
                    theme: {
                        color: "#FF6600"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert(response.error.description);
                });
                rzp1.open();
            }

        } catch (error) {
            console.error("Order placement failed", error);
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (!cart || cart.items.length === 0) {
        return <div className="text-center py-20">Your cart is empty</div>; // Should redirect ideally
    }

    const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + 40;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Address & Payment */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <MapPin className="mr-2 text-primary" size={20} /> Delivery Address
                                </h2>
                                <button
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-primary text-sm font-semibold hover:underline flex items-center"
                                >
                                    <Plus size={16} className="mr-1" /> Add New
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input required placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="p-2 border rounded-lg" />
                                        <input required placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="p-2 border rounded-lg" />
                                        <input required placeholder="Street / Address Line 1" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} className="p-2 border rounded-lg md:col-span-2" />
                                        <input required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="p-2 border rounded-lg" />
                                        <input required placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="p-2 border rounded-lg" />
                                        <input required placeholder="ZIP Code" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} className="p-2 border rounded-lg" />
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="mr-4 text-gray-500">Cancel</button>
                                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-medium">Save Address</button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => setSelectedAddress(addr)}
                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center">
                                                    {addr.name}
                                                    {addr.type && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full uppercase">{addr.type}</span>}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">{addr.street}, {addr.city}, {addr.zip}</div>
                                                <div className="text-sm text-gray-500 mt-2">Phone: {addr.phone}</div>
                                            </div>
                                            <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${selectedAddress?._id === addr._id ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                                {selectedAddress?._id === addr._id && <div className="h-2 w-2 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <CreditCard className="mr-2 text-primary" size={20} /> Payment Method
                            </h2>

                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-orange-50' : 'border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                        className="h-5 w-5 text-primary focus:ring-primary border-gray-300"
                                    />
                                    <span className="ml-3 font-medium text-gray-900 flex items-center"><CreditCard size={18} className="mr-2 text-gray-500" /> Online (UPI, Cards, NetBanking)</span>
                                </label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-orange-50' : 'border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="h-5 w-5 text-primary focus:ring-primary border-gray-300"
                                    />
                                    <span className="ml-3 font-medium text-gray-900 flex items-center"><Banknote size={18} className="mr-2 text-gray-500" /> Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Price Details</h2>
                            <div className="space-y-3 pb-6 border-b border-gray-100 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Price ({cart.items.length} items)</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-600">₹40</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 text-lg py-6">
                                <span>Total Payable</span>
                                <span>₹{total}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={processing}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : `Place Order • ₹${total}`}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

