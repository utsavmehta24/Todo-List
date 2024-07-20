import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";

connectDb();
// get all the works
export async function GET(request) {
    let User = [];
    try {
        User = await user.find().select("-password");
        return NextResponse.json(User,{
            message: "User fetched suceessfully",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            messsage: "Error while fetching the users",
            status: 500,
        });
    }
}

export async function POST(request) {
    const { name, email, password } = await request.json();
    const NewUser = new user({
        name,
        email,
        password
    })
    try {
        await NewUser.save();
        return NextResponse.json(NewUser, {
            message: "User Created Successfully",
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to create the user",
            status: 500
        })
    }
}