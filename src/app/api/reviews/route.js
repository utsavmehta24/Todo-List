import { connectDb } from "@/helper/db";
import { review } from "@/model/review"; // Assuming you have a review model
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// to get all the reviews
export async function GET() {
    try {
        await connectDb();
        const reviews = await review.find();
        return NextResponse.json(reviews, {
            message: "Reviews fetched successfully",
            status: 200
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to fetch the reviews",
            status: 500
        });
    }
}

// to create a new review
export async function POST(request) {
    // Ensuring the database is connected first
    await connectDb(); // Ensures this finishes first

    // Parsing the request body
    const { rating, description } = await request.json(); // Awaits parsing the JSON

    // Fetching the logged-in user (auth token extraction and verification)
    const authToken = await request.cookies.get("authToken")?.value; // Awaits getting the authToken

    let data;
    if (authToken) {
        try {
            // Ensure token verification is awaited before proceeding
            data = await jwt.verify(authToken, process.env.JWT_TOKEN); // Awaits verification
        } catch (err) {
            return NextResponse.json({ message: "Invalid token", status: 401 });
        }
    } else {
        return NextResponse.json({ message: "No auth token provided", status: 401 });
    }

    // Creating a new review
    const newReview = new review({
        rating,
        description,
        userId: data._id,  // Ensure userId is retrieved from verified token data
    });

    try {
        // Await saving the review to the database
        await newReview.save(); // Awaits saving to the database

        // If successful, return a response
        return NextResponse.json(newReview, {
            message: "Review created successfully",
            status: 200
        });
    } catch (error) {
        // Log the error and return a 500 response
        console.error("Error saving review: ", error);
        return NextResponse.json({
            message: "Failed to create the review",
            status: 500
        });
    }
}
