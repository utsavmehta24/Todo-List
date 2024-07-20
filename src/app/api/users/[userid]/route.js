import { connectDb } from "@/helper/db";
import { user } from "@/model/user";
import { NextResponse } from "next/server";

connectDb();
export async function GET(request, { params }) {
    const { userid } = params;

    try {
        const foundUser = await user.findOne({ _id: userid });

        if (!foundUser) {
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }

        return NextResponse.json({
            data: foundUser,
            message: "User found successfully",
            status: 200
        });
    } catch (error) {
        console.error('Error finding the user:', error);

        return NextResponse.json({
            message: "Error finding the user",
            status: 500
        });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userid } = params;
        const deletedUser = await user.findByIdAndDelete(userid);
        if (deletedUser) {
            return NextResponse.json({
                message: 'User deleted',
                success: true
            });
        } else {
            return NextResponse.json({
                message: "No document by this Id",
                success: false
            })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to Create the user",
            success: false
        })

    }
}

export async function PUT(request, { params }) {
    const { userid } = params;
    const { name, email, password } = await request.json();
    try {
        const User = await user.findById(userid);
        if (User) {
            User.name = name;
            // User.email = email;
            User.password = password;
            const UpdatedUser = await User.save();
            return NextResponse.json(UpdatedUser);
        } else {
            return NextResponse.json({
                message: "Failed to fetch the user",
                status: 500
            })
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error while upadting !!",
            status: 200
        })

    }
}





// export async function POST(request) {
//     // const { name, email, password, about, profileURL} = request.json()
//     // const body = request.body
//     // console.log(body);
//     // console.log("Hi How are you ??");
//     // console.log(request.cookies);
//     // console.log(request.headers);
//     // console.log(request.nextUrl.searchParams);

//     // const jsonData = await request.json();
//     // console.log(jsonData);
//     // return NextResponse.json({
//     //     message: 'posted user data'

//     // });
// }