import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';

export default function Sellers() {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const { data } = await api.get('/sellers/analytics');
            setSellers(data);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        } finally {
            setLoading(false);
        }
    };



    // Calculate totals for stats cards
    const totalSellers = sellers.length;
    const totalRevenue = sellers.reduce((sum, s) => sum + (s.stats?.totalRevenue || 0), 0);
    const activeSellers = sellers.filter(s => (s.stats?.totalProducts || 0) > 0).length;
    const topSeller = sellers.length > 0 ? sellers[0] : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500">Loading sellers...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Sellers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalSellers}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Sellers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{activeSellers}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Top Seller</p>
                            <p className="text-lg font-bold text-gray-900 mt-2 truncate">
                                {topSeller?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">₹{(topSeller?.stats?.totalRevenue || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sellers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">All Sellers</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="p-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Seller</th>
                                <th className="p-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Products</th>
                                <th className="p-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Orders</th>
                                <th className="p-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Revenue</th>
                                <th className="p-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                                <th className="p-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sellers.map((seller) => (
                                <tr key={seller._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-5">
                                        <div>
                                            <p className="font-semibold text-gray-900">{seller.name}</p>
                                            <p className="text-sm text-gray-500">{seller.email}</p>
                                            {seller.phone && <p className="text-xs text-gray-400">{seller.phone}</p>}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{seller.stats?.totalProducts || 0}</span>
                                            <span className="text-xs text-green-600">{seller.stats?.activeProducts || 0} active</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{seller.stats?.totalOrders || 0}</span>
                                            <span className="text-xs text-gray-500">
                                                {seller.stats?.completedOrders || 0} completed
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-bold text-gray-900">
                                            ₹{(seller.stats?.totalRevenue || 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-gray-600 text-sm">
                                            {new Date(seller.created_at || seller.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <button
                                            onClick={() => navigate(`/sellers/${seller._id}`)}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {sellers.length === 0 && (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No sellers found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
