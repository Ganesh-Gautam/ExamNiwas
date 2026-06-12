import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Global variable to cache the connection across serverless invocations
let cachedConnection = null;

const connectDB = async () => {
    try {
        // Return cached connection if it exists and is connected
        if (cachedConnection && mongoose.connection.readyState === 1) {
            console.log("Using cached MongoDB connection");
            return cachedConnection;
        }

        // Create new connection
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
            {
                maxPoolSize: 1, // Limit connections for serverless
                minPoolSize: 0,
                socketTimeoutMS: 45000,
                family: 4, // Use IPv4
            }
        );

        cachedConnection = connectionInstance;
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.log("MONGODB connection Failed", error);
        throw error; // Don't exit in serverless, let the function handle it
    }
};

export default connectDB;