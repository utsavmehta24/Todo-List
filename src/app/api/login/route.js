import { user } from "@/model/user";
import { NextResponse } from "next/server";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();

export async function POST(request) {
    const { email, password } = await request.json();
    try {
        const User = await user.findOne({
            email: email,
        });
        if (!User) {
            return NextResponse.json({
                message: "User not found",
                status: false,
            }, {
                status: 404,
            });
        }
        if (!bcrypt.compareSync(password, User.password)) {
            return NextResponse.json({
                message: "Incorrect password",
                status: false,
            }, {
                status: 401,
            });
        }
        const token = await jwt.sign(
            {
                _id: User._id,
                email: User.email,
            },
            process.env.JWT_TOKEN,
        );
        // console.log(token);
        const response = NextResponse.json({
            message: "User logged in successfully",
            status: true,
        });
        response.cookies.set("authToken", token, {
            expiresIn: "1d",
            httpOnly: true, 
        })
        return response 
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Unexpected error",
            status: false,
        }, {
            status: 500
        })
    }
}

