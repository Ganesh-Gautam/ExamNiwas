import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app=express()

app.use(helmet());  
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


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

app.use(notFoundHandler);
app.use(errorHandler);

export {app} 
