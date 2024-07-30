import { NextResponse } from "next/server";
import { connectDb } from "@/helper/db";
import { task } from "@/model/task";

//get all the task of a particular user 
export async function GET(request, { params }) {
    const { userid } = params;
    try {
        await connectDb();
        const tasks = await task.find({ userId: userid });
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