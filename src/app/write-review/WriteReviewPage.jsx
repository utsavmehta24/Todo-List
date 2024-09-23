"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { addReview } from "../Services/Services"; 
import { FaStar } from "react-icons/fa"; 

const WriteReview = () => {
  const [review, setReview] = useState({
    rating: 0,
    description: "",
    userId: "6696b6eb7453fe0af988a135"
  });

  const handleStarClick = (ratingValue) => {
    setReview({ ...review, rating: ratingValue });
  };

  const handleAddReview = async (event) => {
    event.preventDefault();
    try {
      const result = await addReview(review);
      toast.success("Review added successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setReview({
        rating: 0,
        description: "",
        userId: "6696b6eb7453fe0af988a135"
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-10">
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-3xl shadow-xl p-10">
        <div className="text-2xl font-extrabold text-blue-400 tracking-widest text-center mb-6">
          Write a Review
        </div>
        <form onSubmit={handleAddReview}>
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => handleStarClick(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className="cursor-pointer"
                    color={ratingValue <= review.rating ? "#ffc107" : "#e4e5e9"}
                    size={40}
                  />
                </label>
              );
            })}
          </div>

          <div className="text-left mb-6">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              placeholder="Write your review"
              className="w-full p-4 text-sm text-gray-300 bg-gray-700 rounded shadow-inner outline-none"
              name="description"
              onChange={(e) => setReview({ ...review, description: e.target.value })}
              value={review.description}
            />
          </div>

          <div className="flex justify-center">
            <button className="w-1/2 h-12 text-white bg-blue-500 rounded-full shadow hover:bg-blue-600 transition-colors duration-300 font-extrabold">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;
