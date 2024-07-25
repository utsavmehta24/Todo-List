import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";
import * as bcrypt from 'bcrypt';
require('dotenv').config();

// console.log('BCRYPT_SALT:', process.env.BCRYPT_SALT); // Debugging line

connectDb();

// Get all the users
export async function GET(request) {
    try {
        const users = await user.find().select("-password");
        return NextResponse.json(users, {
            message: "Users fetched successfully",
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error while fetching the users",
            status: 500,
        });
    }
}

// Create a new user
export async function POST(request) {
    const { name, email, password } = await request.json();
    const NewUser = new user({
        name,
        email,
        password
    });

    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT);
        NewUser.password = await bcrypt.hash(NewUser.password, saltRounds);

        // Save the new user to the database
        await NewUser.save();
        return NextResponse.json(NewUser, {
            message: "User Created Successfully",
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Failed to create the user",
            status: false,
        }, {
            status: 500,
        });
    }
}
