import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { KeyRound, Mail, ArrowRight, Loader, ShieldCheck } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (data.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Branding & Aesthetic */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 mix-blend-overlay z-10" />
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Office"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                <div className="relative z-20 flex flex-col justify-between p-16 h-full text-white">
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 p-3">
                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Control Center</h1>
                        <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                            Manage your entire marketplace from one powerful, intuitive dashboard. Monitor sales, track users, and scale your business.
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-400 font-medium">
                        <span className="flex items-center gap-2"><ShieldCheck size={16} /> Secure Access</span>
                        <span>•</span>
                        <span>Admin Only</span>
                        <span>•</span>
                        <span>v1.0.0</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium sm:text-sm"
                                        placeholder="admin@sellnow.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <Loader className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
