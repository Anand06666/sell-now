
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Filter, SlidersHorizontal, ChevronDown, Check, Star } from 'lucide-react';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('category') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        sort: 'newest' // newest, price_low, price_high
    });

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        fetchData();
    }, [query, categoryId, filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Build query string
            let url = `/products?keyword=${query}`;
            if (categoryId) url += `&category=${categoryId}`;
            if (filters.sort === 'price_low') url += `&sort=price&order=asc`;
            if (filters.sort === 'price_high') url += `&sort=price&order=desc`;

            // Note: Backend needs to support price filtering, for now fetching all and client filtering if needed, 
            // but assuming backend has basic support or we just show results.

            const [prodRes, catRes] = await Promise.all([
                api.get(url),
                api.get('/categories')
            ]);

            let fetchedProducts = prodRes.data.products || prodRes.data;

            // Client side price filter if backend doesn't support it yet
            if (filters.minPrice) {
                fetchedProducts = fetchedProducts.filter(p => (p.price || p.basePrice) >= Number(filters.minPrice));
            }
            if (filters.maxPrice) {
                fetchedProducts = fetchedProducts.filter(p => (p.price || p.basePrice) <= Number(filters.maxPrice));
            }

            setProducts(fetchedProducts);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden md:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Filter size={20} className="mr-2" /> Filters
                            </h3>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Category</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSearchParams({ q: query, category: '' })}
                                        className={`block w-full text-left text-sm ${!categoryId ? 'text-primary font-bold' : 'text-gray-600 hover:text-gray-900 cursor-pointer'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat._id}
                                            onClick={() => setSearchParams({ q: query, category: cat._id })}
                                            className={`block w-full text-left text-sm cursor-pointer ${categoryId === cat._id ? 'text-primary font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Price</h4>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header & Sort */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {query ? `Search results for "${query}"` : 'All Products'}
                                <span className="text-sm font-normal text-gray-500 ml-2">({products.length} items)</span>
                            </h1>

                            <div className="flex items-center space-x-4 w-full sm:w-auto">
                                <button
                                    className="md:hidden flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white cursor-pointer"
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                >
                                    <SlidersHorizontal size={16} className="mr-2" /> Filters
                                </button>

                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:ring-primary focus:border-primary outline-none cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                                <p className="text-gray-500 text-lg">No products found matching criteria.</p>
                                <button onClick={() => { setSearchParams({}); setFilters({ minPrice: '', maxPrice: '', sort: 'newest' }) }} className="mt-4 text-primary font-medium hover:underline cursor-pointer">Clear all filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col cursor-pointer">
                                        <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                                            <img
                                                src={getImageUrl(product.images?.[0])}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Condition Badge */}
                                            {['refurbished', 'used'].some(c => product.condition?.toLowerCase().includes(c)) && (
                                                <div className="absolute top-2 left-2 bg-amber-100 text-red-600 text-xs font-bold px-2 py-1 rounded shadow-sm border border-amber-200 z-10">
                                                    {product.condition}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <Star size={14} className="text-yellow-400 fill-current" />
                                                <span className="ml-1">{product.averageRating || 'New'}</span>
                                            </div>
                                            <div className="mt-auto pt-3 flex items-center justify-between">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {(() => {
                                                        let finalPrice = product.price || product.basePrice || 0;
                                                        if (product.hasVariants && product.variants?.length > 0) {
                                                            const vPrices = product.variants.map(v => v.price).filter(p => p > 0);
                                                            if (vPrices.length > 0) {
                                                                finalPrice = Math.min(...vPrices);
                                                            }
                                                        }
                                                        return `₹${finalPrice}`;
                                                    })()}
                                                </span>
                                                <span className="text-xs text-primary font-medium px-2 py-1 bg-orange-50 rounded-lg">View Details</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
