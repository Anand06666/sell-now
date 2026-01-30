import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Sellers from './pages/Sellers';
import SellerDetail from './pages/SellerDetail';
import Orders from './pages/Orders';
import SellerApproval from './pages/SellerApproval';
import Login from './pages/Login';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-gray-50 min-h-screen font-inter text-gray-900">
            <Sidebar />
            <main className="flex-1 md:ml-72 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/categories" element={<Categories />} />
                                    <Route path="/users" element={<Users />} />
                                    <Route path="/sellers" element={<Sellers />} />
                                    <Route path="/sellers/:id" element={<SellerDetail />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/seller-approvals" element={<SellerApproval />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
