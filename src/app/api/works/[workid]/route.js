import { connectDb } from "@/helper/db";
import { task } from "@/model/task";
import { NextResponse } from "next/server";

connectDb();
// to get a single task
export async function GET(request, { params }) {

    const { workid } = params;
    try {
        const foundTask = await task.findOne({ _id: workid });
        if (!foundTask) {
            return NextResponse.json({
                message: "Task not found",
                status: 404
            });
        }

        return NextResponse.json({
            data: foundTask,
            message: "Task found successfully",
            status: 200
        });
    } catch (error) {
        console.error('Error finding the task:', error);
        return NextResponse.json({
            message: "Error finding the task",
            status: 500
        });
    }
}

//to delete a single task
export async function DELETE(request, { params }) {

    const { workid } = params;

    try {
        const deletedTask = await task.findByIdAndDelete(workid);
        if (deletedTask) {
            return NextResponse.json({
                message: 'Task deleted',
                success: true
            });
        } else {
            return NextResponse.json({
                message: "No document by this Id",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to Create the task",
            success: false
        });
    }
}

//to update a single task
export async function PUT(request, { params }) {

    const { workid } = params;
    const { title, description, status } = await request.json();

    try {
        const Task = await task.findById(workid);
        if (Task) {
            Task.title = title;
            Task.description = description;
            Task.status = status;
            const UpdatedTask = await Task.save();
            return NextResponse.json(UpdatedTask);
        } else {
            return NextResponse.json({
                message: "No document by this Id",
                success: false
            });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error while upadting !!",
            success: false
        });
    }
}