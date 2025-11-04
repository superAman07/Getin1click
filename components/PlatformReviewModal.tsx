'use client';

import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, X, Loader2, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface PlatformReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlatformReviewModal({ isOpen, onClose }: PlatformReviewModalProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchReview = async () => {
        setIsLoading(true);
        try {
          const { data } = await axios.get('/api/reviews/platform');
          setRating(data.rating);
          setComment(data.comment || '');
          setHasSubmittedBefore(true);
        } catch (error) {
          // This is expected if the user has not submitted a review yet.
          setRating(0);
          setComment('');
          setHasSubmittedBefore(false);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReview();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your feedback...');
    try {
      await axios.post('/api/reviews/platform', { rating, comment });
      toast.success('Thank you for your feedback!', { id: toastId });
      onClose();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Feedback</h2>
            <p className="text-gray-600 mb-6">How has your experience been with 1Click International?</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex justify-center items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={36}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      fill={(hoverRating || rating) >= star ? '#facc15' : '#e5e7eb'}
                      stroke={(hoverRating || rating) >= star ? '#facc15' : '#d1d5db'}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your comments (optional)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-wait flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {hasSubmittedBefore ? 'Update Feedback' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}