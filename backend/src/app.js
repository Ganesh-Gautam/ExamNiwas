import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app=express()

app.use(helmet());  

const corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim()).filter(Boolean);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    }
};

app.use(cors(corsOptions));


app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public"))
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import testRouter from "./routes/test.routes.js";
import studentRouter from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js";

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tests", testRouter)
app.use("/api/v1/students", studentRouter)
app.use("/api/v1/teachers", teacherRouter)

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "ExamNiwas API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export {app} 
