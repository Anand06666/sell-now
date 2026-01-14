import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        activeOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/analytics/admin');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, change: 'Active', isPositive: true },
        { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, change: 'Listed', isPositive: true },
        { label: 'Active Orders', value: stats.activeOrders.toString(), icon: ShoppingBag, change: 'Pending', isPositive: false },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, change: 'Verified', isPositive: true },
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your store today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 3 ? 'bg-green-50 text-green-600' : 'bg-primary/5 text-primary'}`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col justify-center items-center text-gray-400">
                    <p>Live Sales Chart (Coming Soon)</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col justify-center items-center text-gray-400">
                    <p>Recent Activity (Coming Soon)</p>
                </div>
            </div>
        </div>
    );
}
