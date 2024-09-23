"use client";
import React, { useEffect, useState } from 'react';
import { getReviewsOfUser, getUserName } from '../Services/Services';
import { toast } from 'react-toastify';

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviewsOfUser();
                const reviewsWithNames = await Promise.all(
                    data.map(async (review) => {
                        const dataOfUser = await getUserName(review.userId);
                        const name = await dataOfUser.data.name;
                        return { ...review, name };
                    })
                );
                setReviews(reviewsWithNames);
                calculateAverageRating(reviewsWithNames);
            } catch (error) {
                toast.error('Failed to fetch reviews');
            }
        };
        fetchReviews();
    }, []);

    // Calculate the average rating
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviews.length);
    };

    // Render star icons based on rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Full Star
        }
        for (let i = fullStars; i < 5; i++) {
            stars.push(<span key={i} className="text-gray-400">&#9733;</span>); // Empty Star
        }
        return stars;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-10">
            {/* Title with Average Rating */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">Customer Reviews</h1>
                <div className="text-2xl text-yellow-400 mb-2">
                    {averageRating.toFixed(1)} / 5
                </div>
                <div className="flex justify-center">
                    {renderStars(averageRating)} {/* Render average stars */}
                </div>
            </div>

            {/* List of Reviews */}
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-8">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="mb-6 bg-gray-700 p-4 rounded-lg shadow-md">
                            <div className="flex items-center mb-2">
                                <h2 className="text-xl text-blue-400 font-bold mr-4">{review.name}</h2>
                                <div className="flex">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <p className="text-gray-300">{review.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No reviews yet.</div>
                )}
            </div>
        </div>
    );
};

export default ReviewPage;