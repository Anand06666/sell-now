import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { MapPin, Plus, Trash2, Home, Briefcase, Map } from 'lucide-react';

export default function AddressManager() {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', phone: '', street: '', addressLine2: '',
        city: '', state: '', zip: '', landmark: '', type: 'Home', isDefault: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/users/address');
            setAddresses(data);
        } catch (error) {
            console.error('Failed to load addresses');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/users/address/${id}`);
            setAddresses(addresses.filter(addr => addr._id !== id));
        } catch (error) {
            alert('Failed to delete address');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/address', formData);
            setShowForm(false);
            setFormData({
                name: '', phone: '', street: '', addressLine2: '',
                city: '', state: '', zip: '', landmark: '', type: 'Home', isDefault: false
            });
            fetchAddresses();
        } catch (error) {
            alert('Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Work': return <Briefcase size={16} />;
            case 'Other': return <Map size={16} />;
            default: return <Home size={16} />;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center px-4 py-2 bg-gray-50 text-indigo-600 rounded-lg hover:bg-gray-100 font-medium text-sm border border-indigo-100"
                    >
                        <Plus size={16} className="mr-1" /> Add New
                    </button>
                )}
            </div>

            {showForm ? (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 animate-fadeIn">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">New Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                            <input required placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                            <input required placeholder="+91 9876543210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Flat, House no., Building, Company, Apartment</label>
                            <input required placeholder="e.g., Flat 101, Galaxy Apartments" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Area, Colony, Street, Sector, Village</label>
                            <input placeholder="e.g., MG Road, Sector 14" value={formData.addressLine2} onChange={e => setFormData({ ...formData, addressLine2: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">City</label>
                            <input required placeholder="e.g., Mumbai" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">State</label>
                            <input required placeholder="e.g., Maharashtra" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode</label>
                            <input required placeholder="400001" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Landmark</label>
                            <input placeholder="Near City Mall" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="flex gap-2">
                            {['Home', 'Work', 'Other'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${formData.type === type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="mr-2 rounded text-indigo-600"
                            />
                            Make this my default address
                        </label>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3.5 bg-primary text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            Save Address
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <div key={addr._id} className="relative p-4 rounded-xl border border-gray-200 hover:border-black transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="bg-gray-100 p-1.5 rounded text-gray-600">{getTypeIcon(addr.type)}</span>
                                    <span className="font-bold text-gray-900">{addr.type}</span>
                                    {addr.isDefault && <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Default</span>}
                                </div>
                                <button onClick={() => handleDelete(addr._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h4 className="font-semibold text-gray-900">{addr.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{addr.street}, {addr.addressLine2 && `${addr.addressLine2}, `}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.zip}</p>
                            <p className="text-sm text-gray-600 mt-1">Phone: {addr.phone}</p>
                        </div>
                    ))}
                    {addresses.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No addresses saved yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
