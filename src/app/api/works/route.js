import { connectDb } from "@/helper/db";
import { task } from "@/model/task";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET all tasks (optionally filtered by logged in user or all)
export async function GET(request) {
    try {
        const isConnected = await connectDb();
        if (!isConnected) {
            return NextResponse.json([], { status: 200 });
        }

        const authToken = request.cookies.get("authToken")?.value;
        let query = {};
        if (authToken && process.env.JWT_TOKEN) {
            try {
                const data = jwt.verify(authToken, process.env.JWT_TOKEN);
                if (data?._id) {
                    query = { userId: data._id };
                }
            } catch (err) {
                // Invalid or expired token
            }
        }

        const tasks = await task.find(query).sort({ addedDate: -1 });
        return NextResponse.json(tasks, {
            status: 200,
        });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return NextResponse.json([], {
            status: 200, // Return empty array gracefully so client falls back to local storage
        });
    }
}

// POST create a new task
export async function POST(request) {
    try {
        const isConnected = await connectDb();
        const body = await request.json();
        const {
            title,
            description = "",
            status = "pending",
            priority = "medium",
            energy = "medium",
            estimatedMinutes = 30,
            dueDate = null,
            tags = [],
            project = "General",
            subtasks = [],
            recurring = "none",
            userId: bodyUserId
        } = body;

        let effectiveUserId = bodyUserId;
        const authToken = request.cookies.get("authToken")?.value;
        if (authToken && process.env.JWT_TOKEN) {
            try {
                const data = jwt.verify(authToken, process.env.JWT_TOKEN);
                if (data?._id) {
                    effectiveUserId = data._id;
                }
            } catch (err) {
                // Token verification failed
            }
        }

        if (!effectiveUserId) {
            effectiveUserId = "guest_user";
        }

        const newWork = new task({
            title,
            description,
            status,
            priority,
            energy,
            estimatedMinutes,
            dueDate,
            tags,
            project,
            subtasks,
            recurring,
            userId: effectiveUserId,
            addedDate: new Date(),
        });

        if (isConnected) {
            await newWork.save();
        }

        return NextResponse.json(newWork, {
            status: 201,
        });
    } catch (error) {
        console.error("Failed to create task:", error);
        return NextResponse.json({
            message: "Failed to create task on server",
            error: error.message,
        }, {
            status: 500,
        });
    }
}
