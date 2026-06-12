import connectDB from "./db/index.js";
import { app } from "./app.js";

let isConnected = false;

export default async function handler(req, res) {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader(
                "Access-Control-Allow-Credentials",
                "true"
            );
            res.setHeader(
                "Access-Control-Allow-Origin",
                process.env.CORS_ORIGIN || "*"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET,POST,PUT,PATCH,DELETE,OPTIONS"
            );
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
            );

            return res.status(200).end();
        }

        if (!isConnected) {
            await connectDB();
            isConnected = true;
        }

        return app(req, res);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
 
