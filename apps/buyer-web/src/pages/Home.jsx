import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Hero Carousel Logic
    const heroImages = [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    ];
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Parallel fetch
            const [prodRes, catRes] = await Promise.all([
                api.get('/products?limit=100'), // Fetch all products (limit increased)
                api.get('/categories')
            ]);
            setProducts(prodRes.data.products || prodRes.data); // Adjust based on backend response structure
            setCategories(catRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load home data", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Premium Products</span>{' '}
                                    <span className="block text-primary xl:inline">Best Prices</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Discover the latest trends in fashion, electronics, and more. Shop with confidence.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/search" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-orange-600 md:py-4 md:text-lg">
                                            Shop Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Hero Image / Carousel */}
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100 relative">
                    {heroImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                                src={img}
                                alt={`Hero Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
                    {/* <Link to="/categories" className="text-primary hover:underline flex items-center">View All <ArrowRight size={16} className="ml-1" /></Link> */}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.slice(0, 6).map((cat) => (
                        <Link to={`/search?category=${cat._id}`} key={cat._id} className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                            <img
                                src={getImageUrl(cat.image) || 'https://via.placeholder.com/100'}
                                alt={cat.name}
                                className="w-16 h-16 object-cover rounded-full mb-3 group-hover:scale-110 transition-transform"
                            />
                            <span className="font-medium text-gray-700 group-hover:text-primary">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Latest Arrivals</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col">
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
                                        <span className="mx-2">•</span>
                                        <span>{product.totalReviews || 0} reviews</span>
                                    </div>
                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            {/* <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span> */}
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
                                        </div>
                                        <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
