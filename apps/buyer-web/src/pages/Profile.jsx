import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, MapPin, Lock, Landmark, HelpCircle, LogOut, ChevronRight, X } from 'lucide-react';

// Import sub-components
import ProfileInfo from '../components/profile/ProfileInfo';
import AddressManager from '../components/profile/AddressManager';
import ChangePassword from '../components/profile/ChangePassword';
import BankDetails from '../components/profile/BankDetails';
import Support from '../components/profile/Support';

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null); // { label, component }

    const openModal = (item) => {
        setModalContent(item);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    // Handle initial tab from query param if needed, or default to profile
    useEffect(() => {
        // Optional: read tab from URL if we wanted deep linking
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    };

    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: User, component: ProfileInfo },
        { id: 'address', label: 'Manage Addresses', icon: MapPin, component: AddressManager },
        { id: 'bank', label: 'Bank Details', icon: Landmark, component: BankDetails },
        { id: 'security', label: 'Security', icon: Lock, component: ChangePassword },
        { id: 'support', label: 'Help & Support', icon: HelpCircle, component: Support },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-2 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => openModal(item)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-gray-600 group-hover:text-primary">
                                            <Icon size={20} />
                                        </div>
                                        <span className="ml-4 font-medium text-gray-900">{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-primary" />
                                </button>
                            );
                        })}
                        <div className="pt-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-6 py-4 text-left text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <LogOut size={20} />
                                </div>
                                <span className="ml-4 font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Modal */}
            {modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">{modalContent.label}</h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto">
                            <modalContent.component />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
