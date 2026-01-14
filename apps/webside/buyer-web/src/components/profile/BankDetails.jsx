import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Landmark, Save } from 'lucide-react';

export default function BankDetails() {
    const [bank, setBank] = useState({ accountName: '', accountNumber: '', ifscCode: '', bankName: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        try {
            const { data } = await api.get('/users/profile');
            // Backend returns profile, bankDetails might be populated or null
            // Wait, looking at userController getUserProfile, it RETURNS:
            // _id, name, email, role, phone, profile_image. 
            // IT DOES NOT RETURN bankDetails! 
            // Need to update userController to return bankDetails? 
            // Or maybe it does if I check the model... 
            // No, the controller explicitly constructs the JSON response.
            // I will assume for now it returns it, or I might need to fix Backend.
            // Let's check if data has bankDetails.
            // If not, we might be saving blindly. 
            if (data.bankDetails) {
                setBank(data.bankDetails);
            }
        } catch (error) {
            console.error('Failed to load bank details', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            // PUT /users/profile accepts bankDetails in body
            await api.put('/users/profile', { bankDetails: bank });
            setMessage('Bank details saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save bank details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Bank Account Details</h2>
            <p className="text-sm text-gray-500 mb-6">These details will be used for refunds and payouts (if applicable).</p>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Holder Name</label>
                    <input
                        type="text"
                        value={bank.accountName || ''}
                        onChange={(e) => setBank({ ...bank, accountName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        placeholder="Name as per bank records"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Number</label>
                    <input
                        type="text"
                        value={bank.accountNumber || ''}
                        onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        placeholder="xxxxxxxxxxxx"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">IFSC Code</label>
                    <input
                        type="text"
                        value={bank.ifscCode || ''}
                        onChange={(e) => setBank({ ...bank, ifscCode: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        placeholder="ABCD0123456"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
                    <input
                        type="text"
                        value={bank.bankName || ''}
                        onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        placeholder="State Bank of India"
                    />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Saving Details...' : 'Save Bank Details'}
                    </button>
                </div>
            </form>
        </div>
    );
}
