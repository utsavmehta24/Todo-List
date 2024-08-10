import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { user } from "@/model/user";
import { connectDb } from "@/helper/db";


export async function GET(request) {
    try {
        const authToken = await request.cookies.get("authToken")?.value;
        // console.log(authToken);
        const data = jwt.verify(authToken, process.env.JWT_TOKEN);;
        // console.log(data);
        await connectDb();
        const User = await user.findById(data._id).select("-password");
        return NextResponse.json(User);
    } catch (error) {
        const User = {name : "", email: ""};
        return NextResponse.json(User);
    }
}
