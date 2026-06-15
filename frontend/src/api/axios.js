import axios from "axios";
import { extractApiErrorMessage } from "../utils/apiError.js";

const axiosInstance = axios.create({
  baseURL:"https://examniwas.onrender.com/api/v1",
  withCredentials: true
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = new Error(extractApiErrorMessage(error));
    normalizedError.status = error?.response?.status;
    normalizedError.errors = error?.response?.data?.errors ?? [];

    return Promise.reject(normalizedError);
  }
);

export default axiosInstance;
