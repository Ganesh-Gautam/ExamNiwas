import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
            {
                bufferCommands: false,
            }
        );
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
};

export default connectDB;