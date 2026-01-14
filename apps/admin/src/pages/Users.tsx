import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Users() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Users</h1>
                    <p className="text-gray-500 mt-1">View and manage all registered users.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="font-semibold text-gray-900">{user.name || 'Unknown User'}</span>
                                    </div>
                                </td>
                                <td className="p-5 text-sm text-gray-600">{user.email}</td>
                                <td className="p-5">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        user.role === 'seller' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-gray-50 text-gray-700 border-gray-100'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    {/* Placeholder for future delete user functionality */}
                                    <button className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
