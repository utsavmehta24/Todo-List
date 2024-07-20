import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please Enter Your Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
    }
})

export const user = mongoose.models.user2 || mongoose.model("user2", userSchema);