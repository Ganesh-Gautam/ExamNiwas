import dotenv from "dotenv"; 
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

 
await connectDB()
.catch((err)=>{
    console.log("MONGO db connection failed !!! ", err)
})



 
