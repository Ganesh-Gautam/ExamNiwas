import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import testReducer from "../features/tests/testSlice.js";
import submissionReducer from "../features/submissions/submissionSlice.js";

;export const store = configureStore({
  reducer: {
    auth: authReducer,
    tests: testReducer,
    submissions: submissionReducer,
  },
});
