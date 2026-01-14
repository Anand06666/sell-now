import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';
import { Minus, Plus, ShoppingCart, Star, Heart, Share2, Truck, ShieldCheck } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    // Initialize default attributes or price
    useEffect(() => {
        if (product && product.hasVariants && product.variantConfig?.attributes) {
            // Optional: Auto-select first options
            // const defaults = {};
            // product.variantConfig.attributes.forEach(attr => {
            //     if (attr.values.length > 0) defaults[attr.name] = attr.values[0];
            // });
            // setSelectedAttributes(defaults);
        }
    }, [product]);

    useEffect(() => {
        if (id) {
            fetchProduct();
            checkWishlistStatus();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            setMainImage(data.images?.[0]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load product", error);
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;
            const { data } = await api.get(`/wishlist/check/${id}`);
            setIsInWishlist(data.inWishlist);
        } catch (error) {
            console.error("Wishlist check failed", error);
        }
    };

    const toggleWishlist = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }
        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await api.delete(`/wishlist/${id}`);
                setIsInWishlist(false);
            } else {
                await api.post('/wishlist/add', { productId: id });
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error("Wishlist toggle failed", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleAddToCart = async (redirectArgs = null) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Validate selection if variants exist
        if (product.hasVariants) {
            if (product.variantConfig?.attributes) {
                const missingAttr = product.variantConfig.attributes.find(attr => !selectedAttributes[attr.name]);
                if (missingAttr) {
                    alert(`Please select ${missingAttr.name}`);
                    return;
                }
            } else if (!selectedSize) {
                // Legacy check
                alert('Please select a size');
                return;
            }
        }

        // Determine Final Price and Stock based on selection
        let finalPrice = product.price || product.basePrice || 0;
        let finalStock = product.stock || 10;
        let finalVariantId = null;

        if (product.hasVariants && product.variants) {
            const variant = product.variants.find(v =>
                product.variantConfig?.attributes
                    ? product.variantConfig.attributes.every(attr => (v.attributes?.[attr.name] === selectedAttributes[attr.name]) || (v[attr.name] === selectedAttributes[attr.name]))
                    : (v.attributes?.Size === selectedSize || v.attributes?.size === selectedSize || v.size === selectedSize)
            );

            if (variant) {
                finalPrice = variant.price || finalPrice;
                finalStock = variant.stock;
                // finalVariantId = variant._id; // If needed backend wise
            } else {
                // Fallback if no exact match found but hasVariants is true (shouldn't happen if validated)
                // Use Min Price logic
                const prices = product.variants.map(v => v.price).filter(p => p > 0);
                if (prices.length > 0) finalPrice = Math.min(...prices);
            }
        }

        // Safety checks
        finalPrice = Number(finalPrice) > 0 ? Number(finalPrice) : 1;
        const safeImage = mainImage || product.images?.[0] || 'https://via.placeholder.com/150';

        try {
            console.log("Sending AddToCart Payload:", {
                productId: product._id,
                title: product.title,
                price: finalPrice,
                image: safeImage,
                quantity,
                size: selectedSize || Object.values(selectedAttributes).join(', '), // Send attributes string if size is empty
                attributes: selectedAttributes,
                stock: finalStock
            });

            await api.post('/cart', {
                productId: product._id,
                title: product.title,
                price: finalPrice,
                image: safeImage,
                quantity,
                size: selectedSize || Object.values(selectedAttributes).join(', '),
                attributes: selectedAttributes,
                stock: finalStock
            });

            if (redirectArgs) {
                navigate('/checkout');
            } else {
                alert('Added to Cart!');
            }
        } catch (error) {
            console.error("Add to cart failed", error);
            const errMsg = error.response?.data?.message || error.message || 'Failed to add to cart';
            const status = error.response?.status;
            alert(`Error (${status || 'Unknown'}): ${errMsg}`);
        }
    };

    const handleBuyNow = () => {
        // Validation checks same as AddToCart
        if (product.hasVariants) {
            if (product.variantConfig?.attributes?.length > 0) {
                const missing = product.variantConfig.attributes.find(attr => !selectedAttributes[attr.name]);
                if (missing) {
                    alert(`Please select ${missing.name}`);
                    return;
                }
            } else if (!selectedSize) {
                alert('Please select a size');
                return;
            }
        }

        // Determine Final Price and Stock
        let finalPrice = product.price || product.basePrice || 0;
        let finalStock = product.stock || 10;

        if (product.hasVariants && product.variants) {
            const variant = product.variants.find(v =>
                product.variantConfig?.attributes
                    ? product.variantConfig.attributes.every(attr => (v.attributes?.[attr.name] === selectedAttributes[attr.name]) || (v[attr.name] === selectedAttributes[attr.name]))
                    : (v.attributes?.Size === selectedSize || v.attributes?.size === selectedSize || v.size === selectedSize)
            );

            if (variant) {
                finalPrice = variant.price || finalPrice;
                finalStock = variant.stock;
            }
        }

        finalPrice = Number(finalPrice) > 0 ? Number(finalPrice) : 1;
        const safeImage = mainImage || product.images?.[0] || 'https://via.placeholder.com/150';

        const directBuyItem = {
            product: {
                _id: product._id,
                title: product.title,
                image: safeImage, // Pass image for display
                images: product.images // Pass images array if needed
            },
            quantity,
            size: selectedSize || Object.values(selectedAttributes).join(', '),
            attributes: selectedAttributes,
            price: finalPrice,
            stock: finalStock,
            isDirectBuy: true
        };

        navigate('/checkout', { state: { directBuyItem } });
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    const getDisplayPrice = () => {
        if (!product) return 0;

        // 1. If variant is fully selected, show its price
        if (product.hasVariants && product.variants) {
            // Check if all attributes are selected
            const allSelected = product.variantConfig?.attributes?.every(attr => selectedAttributes[attr.name]);

            if (allSelected) {
                const variant = product.variants.find(v =>
                    product.variantConfig.attributes.every(attr => {
                        const val = selectedAttributes[attr.name];
                        // Handle legacy structure where attributes might be flat or nested
                        return (v.attributes?.[attr.name] === val) || (v[attr.name] === val);
                    })
                );
                if (variant && variant.price) return variant.price;
            }

            // 2. If not fully selected or variant not found, show Range or Min price
            const prices = product.variants.map(v => v.price).filter(p => p > 0);
            if (prices.length > 0) {
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                return min === max ? min : `${min} - ${max}`;
            }
        }

        return product.price || product.basePrice || 0;
    };

    const finalDisplayPrice = getDisplayPrice();

    const handleAttributeSelect = (attrName, value) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attrName]: value
        }));

        // Update selectedSize for legacy compatibility if attribute is "Size"
        if (attrName.toLowerCase() === 'size') {
            setSelectedSize(value);
        }
    };

    // Helper to check stock for a potential selection
    const isAttributeAvailable = (attrName, value) => {
        // Logic to disable unavailable combinations can go here
        return true;
    };

    // ... (render)

    // Replace the old return statement parts in logic flow
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden shadow-inner relative">
                                <img
                                    src={getImageUrl(mainImage)}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                {['refurbished', 'used'].some(c => product.condition?.toLowerCase().includes(c)) && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-md z-10 uppercase tracking-wide">
                                        {product.condition}
                                    </div>
                                )}
                                <button
                                    onClick={toggleWishlist}
                                    disabled={wishlistLoading}
                                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white shadow transition-all z-10"
                                >
                                    <Heart size={20} className={`${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                                </button>
                            </div>
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {product.images?.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 cursor-pointer ${mainImage === img ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
                                    {product.title}
                                    {['refurbished', 'used'].some(c => product.condition?.toLowerCase().includes(c)) && (
                                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase border border-amber-200">
                                            {product.condition}
                                        </span>
                                    )}
                                </h1>
                                <div className="mt-2 flex items-center space-x-4">
                                    <span className="text-3xl font-bold text-primary">₹{finalDisplayPrice}</span>
                                    {/* <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span> */}
                                    <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-sm font-semibold">In Stock</span>
                                </div>
                                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < Math.floor(product.averageRating || 0) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span>({product.totalReviews} Reviews)</span>
                                </div>
                            </div>

                            {/* Prominent Condition Display */}
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm text-gray-500 font-medium">Condition: </span>
                                <span className={`font-bold capitalize ${['refurbished', 'used'].some(c => product.condition?.toLowerCase().includes(c)) ? 'text-amber-700' : 'text-green-700'}`}>
                                    {product.condition || 'New'}
                                </span>
                                <span className="text-xs text-gray-400 ml-2">
                                    {['refurbished', 'used'].some(c => product.condition?.toLowerCase().includes(c))
                                        ? '(Professionally inspected and tested)'
                                        : '(Brand new, unused)'}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 my-6"></div>

                            {/* Dynamic Variant Selection */}
                            {product.hasVariants && product.variantConfig?.attributes?.length > 0 && product.variantConfig.attributes.map((attr, idx) => (
                                <div key={idx} className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select {attr.name}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {attr.values.map((val) => {
                                            const isSelected = selectedAttributes[attr.name] === val;
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => handleAttributeSelect(attr.name, val)}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${isSelected
                                                        ? 'border-primary bg-primary text-white shadow-md shadow-primary/30'
                                                        : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                                                        }`}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Legacy Size Fallback (ONLY if dynamic config is missing or empty) */}
                            {product.hasVariants && (!product.variantConfig?.attributes || product.variantConfig.attributes.length === 0) && sizes.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select Size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${selectedSize === size
                                                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/30'
                                                    : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAddToCart()}
                                    className="flex-1 bg-white text-primary border-2 border-primary py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <ShoppingCart size={20} />
                                    <span>Add to Cart</span>
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <span>Buy Now</span>
                                </button>
                                <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Truck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{product.shippingCost > 0 ? `₹${product.shippingCost} Delivery` : 'Free Delivery'}</p>
                                <p className="text-xs text-gray-500">{product.timeToShip || 'Ships in 2-3 days'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{product.returnPolicy === 'no_return' ? 'No Returns' : `${product.returnWindow || 7} Days ${product.returnPolicy === 'replacement' ? 'Replacement' : 'Return'}`}</p>
                                <p className="text-xs text-gray-500">Subject to terms</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    {/* Product Specifications */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Condition</span>
                                <span className="font-medium text-gray-900 capitalize">{product.condition}</span>
                            </div>

                            {/* Variant Attributes */}
                            {product.hasVariants && product.variantConfig?.attributes?.map((attr, idx) => (
                                <div key={`var-${idx}`} className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500 capitalize">{attr.name}</span>
                                    <span className="font-medium text-gray-900">{attr.values.join(', ')}</span>
                                </div>
                            ))}

                            {/* Custom Attributes */}
                            {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500 capitalize">{key}</span>
                                    <span className="font-medium text-gray-900">{value}</span>
                                </div>
                            ))}

                            {/* Category Info */}
                            {product.subcategory && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Category</span>
                                    <span className="font-medium text-gray-900">{product.subcategory}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>

                    {/* Review Section */}
                    <ReviewSection productId={product._id} />

                </div>
            </div>
            <Footer />
        </div>
    );
}
