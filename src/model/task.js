import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'just_added'],
        default: 'just_added',
        required: true,
    },
    addedDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    userId: {
        type: mongoose.ObjectId, 
        required: true
    }
});

export const task = mongoose.models.task || mongoose.model("task", taskSchema);