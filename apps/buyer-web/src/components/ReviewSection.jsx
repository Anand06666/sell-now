
import React, { useEffect, useState } from 'react';
import api, { getImageUrl } from '../utils/api';
import { Star, ThumbsUp, User } from 'lucide-react';

export default function ReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/reviews/product/${productId}`);
            setReviews(data.reviews || []);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("Please login to write a review");
            return;
        }

        setSubmitLoading(true);
        try {
            await api.post('/reviews', {
                productId,
                ...formData
            });
            setShowForm(false);
            setFormData({ rating: 5, title: '', comment: '' });
            fetchReviews(); // Refresh list
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Submit review error", error);
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div className="py-8 text-center text-gray-500">Loading reviews...</div>;

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">Customer Reviews ({reviews.length})</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                >
                    Write a Review
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="text-lg font-semibold mb-4">Write your review</h4>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="focus:outline-none cursor-pointer"
                                >
                                    <Star
                                        size={24}
                                        className={star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                            placeholder="Summarize your experience"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                            placeholder="What did you like or dislike?"
                            value={formData.comment}
                            onChange={e => setFormData({ ...formData, comment: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className={`px-6 py-2 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-orange-600 cursor-pointer ${submitLoading ? 'opacity-70' : ''}`}
                        >
                            {submitLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <User size={16} />
                                    </div>
                                    <span className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</span>
                                    {review.verified && (
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Verified Purchase</span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex text-yellow-400 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                            </div>

                            <h4 className="font-bold text-gray-900 mb-1">{review.title}</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">{review.comment}</p>

                            {/* Helpful button functionality could be added here */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
