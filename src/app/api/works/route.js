import { connectDb } from "@/helper/db";
import { task } from "@/model/task";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// to get all the tasks
export async function GET() {
    try {
        await connectDb();
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
    await connectDb();
    const { title, description, status, userId } = await request.json();

    //fetching logged in user
    const authToken = await request.cookies.get("authToken")?.value;
    // console.log(authToken);
    const data = jwt.verify(authToken, process.env.JWT_TOKEN);;
    // console.log(data);
    console.log(data._id);

    const newWork = new task({
        status,
        title,
        description,
        userId: data._id,
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