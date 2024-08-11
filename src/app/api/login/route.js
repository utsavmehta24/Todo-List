// pages/api/login.js
import { user } from "@/model/user";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDb } from "@/helper/db";

export async function POST(request) {
  const { email, password } = await request.json();
  try {
    await connectDb();
    const User = await user.findOne({ email: email });

    if (!User) {
      return NextResponse.json(
        { message: "User not found", status: false },
        { status: 404 }
      );
    }

    if (!bcrypt.compareSync(password, User.password)) {
      return NextResponse.json(
        { message: "Incorrect password", status: false },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        _id: User._id,
        email: User.email,
      },
      process.env.JWT_TOKEN
    );

    const response = NextResponse.json({
      message: "User logged in successfully",
      status: true,
      user: User,
    });

    const cookieStore = cookies();
    cookieStore.set("authToken", token, {
      maxAge: 24 * 60 * 60, // 1 day in seconds
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Unexpected error", status: false },
      { status: 500 }
    );
  }
}