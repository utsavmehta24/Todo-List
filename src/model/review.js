import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    description: {
        type: String,
        required: true,
    },
    addedDate: {
        type: Date,
        required: true,
        default: Date.now, 
    },
    userId: {
        type: mongoose.ObjectId,
        required: true,
    }
});

export const review = mongoose.models.review2 || mongoose.model("review2", reviewSchema);
