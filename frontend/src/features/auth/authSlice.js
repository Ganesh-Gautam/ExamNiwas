import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateAccountDetails,
    updateUserAvatar,
} from "./authService.js";

const login = createAsyncThunk("auth/login", async(data)=>{
    return await loginUser(data);
})

const register = createAsyncThunk("auth/register", async(data)=>{
    return await registerUser(data);
})

const logout = createAsyncThunk("auth/logout", async () => {
    return await logoutUser();
});

const fetchCurrentUser = createAsyncThunk("auth/currentUser",async()=>{
    return await getCurrentUser();
});

const updateProfileDetails = createAsyncThunk("auth/updateProfileDetails", async(data)=>{
    return await updateAccountDetails(data);
});

const updateAvatar = createAsyncThunk("auth/updateAvatar", async(file)=>{
    return await updateUserAvatar(file);
});

const changePassword = createAsyncThunk("auth/changePassword", async(data)=>{
    return await changeCurrentPassword(data);
});

const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : null,
        status : false,  
        isLoading: false,
        isUpdating: false,
    },
    reducers : {},
    extraReducers : (builder) =>{
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.status=true;
            state.user = action.payload.data.user;
        })
        .addCase(login.rejected, (state) => {
            state.isLoading = false;
            state.status = false;
        })
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.status=false;
            state.user = action.payload.data;
        })
        .addCase(register.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.status=true;
            state.user = action.payload.data;
        })
        .addCase(fetchCurrentUser.rejected, (state) => {
            state.isLoading = false;
            state.status = false;
            state.user = null;
        })
        .addCase(logout.fulfilled, (state) => {
            state.isLoading = false;
            state.status=false;
            state.user = null;
        })
        .addCase(logout.rejected, (state) => {
            state.isLoading = false;
            state.status=false;
            state.user = null;
        })
        .addCase(updateProfileDetails.pending, (state) => {
            state.isUpdating = true;
        })
        .addCase(updateProfileDetails.fulfilled, (state, action) => {
            state.isUpdating = false;
            state.user = action.payload.data;
        })
        .addCase(updateProfileDetails.rejected, (state) => {
            state.isUpdating = false;
        })
        .addCase(updateAvatar.pending, (state) => {
            state.isUpdating = true;
        })
        .addCase(updateAvatar.fulfilled, (state, action) => {
            state.isUpdating = false;
            state.user = action.payload.data;
        })
        .addCase(updateAvatar.rejected, (state) => {
            state.isUpdating = false;
        })
        .addCase(changePassword.pending, (state) => {
            state.isUpdating = true;
        })
        .addCase(changePassword.fulfilled, (state) => {
            state.isUpdating = false;
        })
        .addCase(changePassword.rejected, (state) => {
            state.isUpdating = false;
        });
    }
})
export {login, register, logout, fetchCurrentUser, updateProfileDetails, updateAvatar, changePassword}
export default authSlice.reducer;
