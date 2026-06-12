import axios from "axios";
import { extractApiErrorMessage } from "../utils/apiError.js";

const baseURL = import.meta.env.VITE_API_URL || "https://exam-niwas.vercel.app/api/v1";

const axiosInstance = axios.create({
  baseURL,
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
