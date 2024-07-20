import { connectDb } from "@/helper/db";
import { task } from "@/model/task";
import { NextResponse } from "next/server";

connectDb();
// to get all the tasks
export async function GET() {
    try {
        const tasks = await task.find();
        return NextResponse.json(tasks, {
            message: "Tasks fetched successfully",
            status: 200
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to fetch the tasks",
            status: 500
        });
    }
 }


// to create a new task
export async function POST(request) {
    const { title, description, userId } = await request.json();

    const newWork = new task({
        title,
        description,
        userId,
    });
    try {
        await newWork.save();
        return NextResponse.json(newWork, {
            message: "Work created successfully",
            status: 200
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to create the work",
            status: 500
        });
    }
}