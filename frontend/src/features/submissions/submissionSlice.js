import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAvailableTests,
  getTestQuestions,
  submitAnswers,
  getStudentTestResult,
  getStudentResults,
  getTeacherStudentResults,
  getSubmissionDetails,
  getTeacherSubmissionDetails,
  evaluateSubmission,
} from "./submissionService.js";

const fetchAvailableTests = createAsyncThunk(
  "submissions/fetchAvailableTests",
  async () => {
    return await getAvailableTests();
  }
);

const fetchTestQuestions = createAsyncThunk(
  "submissions/fetchTestQuestions",
  async (data) => {
    return await getTestQuestions(data);
  }
);

const submitTestAnswers = createAsyncThunk(
  "submissions/submitTestAnswers",
  async (data) => {
    return await submitAnswers(data);
  }
);

const fetchStudentTestResult = createAsyncThunk(
  "submissions/fetchStudentTestResult",
  async (data) => {
    return await getStudentTestResult(data);
  }
);

const fetchStudentResults = createAsyncThunk(
  "submissions/fetchStudentResults",
  async () => {
    return await getStudentResults();
  }
);

const fetchTeacherStudentResults = createAsyncThunk(
  "submissions/fetchTeacherStudentResults",
  async () => {
    return await getTeacherStudentResults();
  }
);

const fetchSubmissionDetails = createAsyncThunk(
  "submissions/fetchSubmissionDetails",
  async (data) => {
    return await getSubmissionDetails(data);
  }
);

const fetchTeacherSubmissionDetails = createAsyncThunk(
  "submissions/fetchTeacherSubmissionDetails",
  async (data) => {
    return await getTeacherSubmissionDetails(data);
  }
);

const evaluateTeacherSubmission = createAsyncThunk(
  "submissions/evaluateTeacherSubmission",
  async (data) => {
    return await evaluateSubmission(data);
  }
);

const submissionSlice = createSlice({
  name: "submissions",
  initialState: {
    availableTests: [],
    currentTest: null,
    currentQuestions: [],
    currentResult: null,
    studentResults: [],
    teacherResults: [],
    submissionDetails: null,
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {
    clearCurrentTest: (state) => {
      state.currentTest = null;
      state.currentQuestions = [];
    },
    clearSubmissionDetails: (state) => {
      state.submissionDetails = null;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableTests = action.payload.data;
      })
      .addCase(fetchAvailableTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch tests";
      })
      .addCase(fetchTestQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTestQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTest = action.payload.data.test;
        state.currentQuestions = action.payload.data.questions;
      })
      .addCase(fetchTestQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch questions";
      })
      .addCase(submitTestAnswers.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(submitTestAnswers.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentResult = action.payload.data;
        state.submissionDetails = action.payload.data;
      })
      .addCase(submitTestAnswers.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not submit answers";
      })
      .addCase(fetchStudentTestResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentTestResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResult = action.payload.data;
      })
      .addCase(fetchStudentTestResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch test result";
      })
      .addCase(fetchStudentResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentResults = action.payload.data;
      })
      .addCase(fetchStudentResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch results";
      })
      .addCase(fetchTeacherStudentResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherStudentResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teacherResults = action.payload.data;
      })
      .addCase(fetchTeacherStudentResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch teacher results";
      })
      .addCase(fetchSubmissionDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissionDetails = action.payload.data;
      })
      .addCase(fetchSubmissionDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch submission details";
      })
      .addCase(fetchTeacherSubmissionDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherSubmissionDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissionDetails = action.payload.data;
      })
      .addCase(fetchTeacherSubmissionDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch teacher submission details";
      })
      .addCase(evaluateTeacherSubmission.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(evaluateTeacherSubmission.fulfilled, (state, action) => {
        state.isSaving = false;
        state.submissionDetails = action.payload.data;
      })
      .addCase(evaluateTeacherSubmission.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not evaluate submission";
      });
  },
});

export const { clearCurrentTest, clearSubmissionDetails, clearCurrentResult } =
  submissionSlice.actions;
export {
  fetchAvailableTests,
  fetchTestQuestions,
  submitTestAnswers,
  fetchStudentTestResult,
  fetchStudentResults,
  fetchTeacherStudentResults,
  fetchSubmissionDetails,
  fetchTeacherSubmissionDetails,
  evaluateTeacherSubmission,
};
export default submissionSlice.reducer;
