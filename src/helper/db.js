import mongoose from "mongoose";

let isConnecting = false;

export async function connectDb() {
    try {
        if (mongoose.connection.readyState === 1) {
            return true;
        }

        if (isConnecting) {
            return false;
        }

        if (!process.env.MONGO_DB_URL) {
            console.warn("MONGO_DB_URL is not defined in environment.");
            return false;
        }

        isConnecting = true;
        await mongoose.connect(process.env.MONGO_DB_URL, {
            dbName: "Work_manager",
            serverSelectionTimeoutMS: 3000, // Timeout fast instead of hanging builds
        });

        console.log("MongoDB connected successfully");
        isConnecting = false;
        return true;
    } catch (error) {
        isConnecting = false;
        console.warn("Failed to connect to MongoDB (continuing in local-first mode):", error.message);
        return false;
    }
}
