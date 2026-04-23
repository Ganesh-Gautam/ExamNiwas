import axios from "../../api/axios.js";

 

const registerUser = async(data )=>{
    const res = await axios.post("/users/register" ,data);
    return res.data;
}

const loginUser = async(data )=>{
    const res = await axios.post("/users/login",data);
    return res.data;
}
const logoutUser = async()=>{
    const res = await axios.post("/users/logout");
    return res.data;
}
const getCurrentUser = async()=>{
    const res = await axios.get("/users/current-user");
     return res.data;
}

export {loginUser , registerUser ,logoutUser , getCurrentUser}
