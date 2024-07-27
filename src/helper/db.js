import mongoose from "mongoose";

export async function connectDb() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URL, {
            dbName: "Work_manger",
        });

        // console.log("MongoDB connected");

        // const host = connection.connections[0].host;
        // console.log("Connected with host", host);

    } catch (error) {
        console.log("Failed to connect");
        console.log(error);
    }
}
