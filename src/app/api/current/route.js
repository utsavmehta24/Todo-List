import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { user } from "@/model/user";

export async function GET(request) {
    try {
        const authToken = await request.cookies.get("authToken")?.value;
        if (!authToken) {
            return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
        }

        const token = jwt.verify(authToken, process.env.JWT_TOKEN);
        if (!token) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const User = await user.findById(token._id).select("-password -_id");
        if (!User) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(User);
    } catch (error) {
        console.error("Error in GET /api/current:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
