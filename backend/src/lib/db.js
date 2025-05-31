import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    try {
        const connectionString = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected : ${connectionString.connection.host}`);

    } catch (error) {
        console.log("Error in connecting to MongoDB ", error);
        process.exit(1); //1 means faliure
    }
}