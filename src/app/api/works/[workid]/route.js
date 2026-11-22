import { connectDb } from "@/helper/db";
import { task } from "@/model/task";
import { NextResponse } from "next/server";

// GET a single task
export async function GET(request, { params }) {
    const { workid } = params;
    try {
        const isConnected = await connectDb();
        if (!isConnected) {
            return NextResponse.json({ message: "DB not connected" }, { status: 503 });
        }

        const foundTask = await task.findById(workid);
        if (!foundTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(foundTask, { status: 200 });
    } catch (error) {
        console.error("Error finding task:", error);
        return NextResponse.json({ message: "Error finding task" }, { status: 500 });
    }
}

// DELETE a task
export async function DELETE(request, { params }) {
    const { workid } = params;
    try {
        const isConnected = await connectDb();
        if (!isConnected) {
            return NextResponse.json({ message: "Task deleted locally", success: true });
        }

        await task.findByIdAndDelete(workid);
        return NextResponse.json({ message: "Task deleted", success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ message: "Error deleting task", success: false }, { status: 500 });
    }
}

// PUT / UPDATE a task
export async function PUT(request, { params }) {
    const { workid } = params;
    try {
        const updates = await request.json();
        const isConnected = await connectDb();
        if (!isConnected) {
            return NextResponse.json({ ...updates, _id: workid });
        }

        const updated = await task.findByIdAndUpdate(workid, { $set: updates }, { new: true });
        return NextResponse.json(updated || { ...updates, _id: workid });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ message: "Error updating task", success: false }, { status: 500 });
    }
}
