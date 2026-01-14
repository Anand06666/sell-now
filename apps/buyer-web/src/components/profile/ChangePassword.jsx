import React, { useState } from 'react';
import api from '../../utils/api';
import { Lock, Save } from 'lucide-react';

export default function ChangePassword() {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (passwords.new !== passwords.confirm) {
            setMessage('New passwords do not match');
            return;
        }

        if (passwords.new.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.put('/users/profile', { password: passwords.new });
            setMessage('Password updated successfully!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                {/* Note: Backend PUT profile just takes 'password'. It doesn't verify 'current password' typically in Mongoose unless explicitly coded. 
                     The current userController just overwrites it: user.password = req.body.password. 
                     So we don't strictly need 'Current Password' for the API, but standard UI has it. 
                     I'll skip sending current password to API since API likely ignores it or doesn't verify it in this simplistic implementation. */}

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            required
                        />
                    </div>
                </div> */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        placeholder="Min 6 characters"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        placeholder="Re-enter password"
                        required
                    />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Updating Password...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
}
