'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, Trash2, Loader2, Search, Filter, User, ShieldCheck, MessageSquare} from 'lucide-react';
import { UserRole } from '@prisma/client';
import { format } from 'date-fns';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    isFeatured: boolean;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
        role: UserRole;
    };
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-amber-400' : 'text-slate-300'}
                fill={i < rating ? 'currentColor' : 'none'}
            />
        ))}
    </div>
);

export default function ManagePlatformReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/admin/platform-reviews');
                setReviews(data);
            } catch (error) {
                toast.error('Failed to load reviews.');
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleToggleFeatured = async (review: Review) => {
        const originalReviews = [...reviews];
        const updatedReviews = reviews.map(r =>
            r.id === review.id ? { ...r, isFeatured: !r.isFeatured } : r
        );
        setReviews(updatedReviews);

        try {
            await axios.put(`/api/admin/platform-reviews/${review.id}`, {
                isFeatured: !review.isFeatured,
            });
            toast.success(`Review ${!review.isFeatured ? 'featured' : 'unfeatured'}.`);
        } catch (error) {
            setReviews(originalReviews);
            toast.error('Failed to update review status.');
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        const toastId = toast.loading('Deleting review...');
        try {
            await axios.delete(`/api/admin/platform-reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
            toast.success('Review deleted.', { id: toastId });
        } catch (error) {
            toast.error('Failed to delete review.', { id: toastId });
        }
    };

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const matchesSearch =
                review.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filter === 'ALL' ||
                (filter === 'FEATURED' && review.isFeatured) ||
                (filter === '5_STARS' && review.rating === 5) ||
                (filter === '4_STARS' && review.rating === 4) ||
                (filter === '3_STARS' && review.rating === 3) ||
                (filter === '2_STARS' && review.rating === 2) ||
                (filter === '1_STAR' && review.rating === 1);

            return matchesSearch && matchesFilter;
        });
    }, [reviews, searchTerm, filter]);

    return (
        <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Platform Reviews</h1>
                <p className="text-slate-600 mb-8">Manage user feedback and feature the best testimonials on your homepage.</p>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by user, email, or comment..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Reviews</option>
                                <option value="FEATURED">Featured</option>
                                <option value="5_STARS">5 Stars</option>
                                <option value="4_STARS">4 Stars</option>
                                <option value="3_STARS">3 Stars</option>
                                <option value="2_STARS">2 Stars</option>
                                <option value="1_STAR">1 Star</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center p-12"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 text-left">User</th>
                                        <th className="px-6 py-3 text-left">Review</th>
                                        <th className="px-6 py-3 text-center">Featured</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredReviews.map(review => (
                                        <tr key={review.id}>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-semibold text-slate-800">{review.user.name || 'Anonymous'}</div>
                                                <div className="text-slate-500">{review.user.email}</div>
                                                <span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${review.user.role === 'PROFESSIONAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {review.user.role === 'PROFESSIONAL' ? <ShieldCheck size={12} /> : <User size={12} />}
                                                    {review.user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-md align-top">
                                                <StarRating rating={review.rating} />
                                                <p className="text-slate-700 mt-2 italic">"{review.comment || 'No comment provided.'}"</p>
                                                <div className="text-xs text-slate-400 mt-2">{format(new Date(review.createdAt), 'dd MMM, yyyy')}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center align-middle">
                                                <label htmlFor={`featured-${review.id}`} className="flex justify-center items-center cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            id={`featured-${review.id}`}
                                                            className="sr-only"
                                                            checked={review.isFeatured}
                                                            onChange={() => handleToggleFeatured(review)}
                                                        />
                                                        <div className={`block w-10 h-6 rounded-full ${review.isFeatured ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${review.isFeatured ? 'translate-x-4' : ''}`}></div>
                                                    </div>
                                                </label>
                                            </td>
                                            <td className="px-6 py-4 text-right align-middle">
                                                <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                         { !loading && filteredReviews.length === 0 && (
                            <div className="text-center p-12">
                                <MessageSquare className="mx-auto text-slate-300" size={48} />
                                <h3 className="mt-4 text-lg font-semibold text-slate-800">No Reviews Found</h3>
                                <p className="mt-1 text-slate-500">Try adjusting your search or filter settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}