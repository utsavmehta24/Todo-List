import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { user } from "@/model/user";

export async function GET(request) {
    try {
        const authToken = await request.cookies.get("authToken")?.value;
        // console.log(authToken);
        const data = jwt.verify(authToken, process.env.JWT_TOKEN);;
        // console.log(data);
        const User = await user.findById(data._id).select("-password");
        return NextResponse.json(User);
    } catch (error) {
        return NextResponse.json({ error: "Not authorized" });
    }
}
