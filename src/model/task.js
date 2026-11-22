import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending',
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    energy: {
        type: String,
        enum: ['quick_win', 'low', 'medium', 'high'],
        default: 'medium',
    },
    estimatedMinutes: {
        type: Number,
        default: 30,
    },
    dueDate: {
        type: Date,
        default: null,
    },
    tags: {
        type: [String],
        default: [],
    },
    project: {
        type: String,
        default: "General",
    },
    subtasks: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }],
    recurring: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none',
    },
    addedDate: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
}, {
    timestamps: true,
});

export const task = mongoose.models.task || mongoose.model("task", taskSchema);
