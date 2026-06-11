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

const updateAccountDetails = async(data)=>{
    const res = await axios.patch("/users/update-account", data);
    return res.data;
}

const changeCurrentPassword = async(data)=>{
    const res = await axios.post("/users/change-password", data);
    return res.data;
}

const updateUserAvatar = async(file)=>{
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.patch("/users/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    updateAccountDetails,
    changeCurrentPassword,
    updateUserAvatar,
}
