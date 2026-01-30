import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users as UsersIcon, LogOut, ChevronRight, FolderTree, Store, ShoppingCart, CheckCircle, Menu, X } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function Sidebar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const links = [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
        { label: 'Products', icon: ShoppingBag, to: '/products' },
        { label: 'Categories', icon: FolderTree, to: '/categories' },
        { label: 'Orders', icon: ShoppingCart, to: '/orders' },
        { label: 'Sellers', icon: Store, to: '/sellers' },
        { label: 'Seller Approvals', icon: CheckCircle, to: '/seller-approvals' },
        { label: 'Users', icon: UsersIcon, to: '/users' },
        { label: 'Settings', icon: Store, to: '/settings' },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4 justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg text-gray-900">SellNow</span>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold text-xs border border-gray-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8 pb-6 border-b border-gray-100/50 flex items-center justify-between gap-3.5">
                    <div className="flex items-center gap-3.5">
                        <img src={logo} alt="SellNow Logo" className="w-10 h-10 object-contain" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">SellNow</h1>
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest mt-0.5 block opacity-90">Workspace</span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-6 overflow-y-auto flex-1">
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Main Menu</p>
                    <nav className="space-y-1.5">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)} // Close on navigate (mobile)
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/10 scale-[1.02]'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-3.5">
                                            <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                                            <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{link.label}</span>
                                        </div>
                                        <ChevronRight size={16} className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <div className="bg-gray-50 p-4 rounded-2xl mb-4 flex items-center gap-3.5 border border-gray-100">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg shadow-sm border border-gray-100">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email || 'Admin Panel'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-3.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl w-full transition-all duration-200 font-semibold text-sm border border-transparent hover:border-red-100 group"
                    >
                        <LogOut size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
