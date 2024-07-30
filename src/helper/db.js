import mongoose from "mongoose";

export async function connectDb() {
    try {
        // Check if the default connection is already open
        if (mongoose.connection.readyState === 1) { // 1 means connected
            console.log("MongoDB is already connected");
            return;
        }
        
        // Establish a new connection
        await mongoose.connect(process.env.MONGO_DB_URL, {
            dbName: "Work_manager",
            useNewUrlParser: true, // To handle deprecation warnings
            useUnifiedTopology: true, // To handle deprecation warnings
        });

        console.log("MongoDB connected");

    } catch (error) {
        console.log("Failed to connect to MongoDB");
        console.log(error);
    }
}
