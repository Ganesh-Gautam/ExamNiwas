import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addQuestions, createTest, deleteQuestion, getTeacherTests, updateQuestion, updateTest, deleteTest } from "./testService.js";

const createTeacherTest = createAsyncThunk("tests/createTeacherTest", async (data) => {
  return await createTest(data);
});

const addTestQuestions = createAsyncThunk("tests/addTestQuestions", async (data) => {
  return await addQuestions(data);
});

const removeTestQuestion = createAsyncThunk("tests/removeTestQuestion", async (data) => {
  return await deleteQuestion(data);
});

const updateTestQuestion = createAsyncThunk("tests/updateTestQuestion", async (data) => {
  return await updateQuestion(data);
});

const updateTeacherTest = createAsyncThunk("tests/updateTeacherTest", async (data) => {
  return await updateTest(data);
});

const deleteTeacherTest = createAsyncThunk("tests/deleteTeacherTest", async (data) => {
  return await deleteTest(data);
});

const fetchTeacherTests = createAsyncThunk("tests/fetchTeacherTests", async () => {
  return await getTeacherTests();
});

const testSlice = createSlice({
  name: "tests",
  initialState: {
    items: [],
    latestCreatedTest: null,
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {
    clearLatestCreatedTest: (state) => {
      state.latestCreatedTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherTests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchTeacherTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Could not fetch tests";
      })
      .addCase(createTeacherTest.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createTeacherTest.fulfilled, (state, action) => {
        state.isSaving = false;
        state.latestCreatedTest = action.payload.data;
        state.items = [
          {
            ...action.payload.data,
            questions: [],
            questionCount: 0,
            totalMarks: 0,
          },
          ...state.items,
        ];
      })
      .addCase(createTeacherTest.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not create test";
      })
      .addCase(addTestQuestions.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(addTestQuestions.fulfilled, (state, action) => {
        state.isSaving = false;
        const createdQuestions = action.payload.data ?? [];
        const firstQuestion = createdQuestions[0];

        if (firstQuestion?.testId) {
          state.items = state.items.map((test) =>
            test._id === firstQuestion.testId
              ? {
                  ...test,
                  questions: [...(test.questions ?? []), ...createdQuestions],
                  questionCount: (test.questionCount ?? 0) + createdQuestions.length,
                  totalMarks:
                    (test.totalMarks ?? 0) +
                    createdQuestions.reduce((sum, item) => sum + (Number(item.marks) || 0), 0),
                }
              : test
          );
        }
      })
      .addCase(addTestQuestions.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not save questions";
      })
      .addCase(removeTestQuestion.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(removeTestQuestion.fulfilled, (state, action) => {
        state.isSaving = false;
        const deletedQuestion = action.payload.data;

        if (!deletedQuestion?.testId || !deletedQuestion?._id) {
          return;
        }

        state.items = state.items.map((test) =>
          test._id === deletedQuestion.testId
            ? {
                ...test,
                questions: (test.questions ?? []).filter((question) => question._id !== deletedQuestion._id),
                questionCount: Math.max((test.questionCount ?? 0) - 1, 0),
                totalMarks: Math.max((test.totalMarks ?? 0) - (Number(deletedQuestion.marks) || 0), 0),
              }
            : test
        );
      })
      .addCase(removeTestQuestion.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not remove question";
      })
      .addCase(updateTestQuestion.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateTestQuestion.fulfilled, (state, action) => {
        state.isSaving = false;
        const updatedQuestion = action.payload.data;

        if (!updatedQuestion?.testId || !updatedQuestion?._id) {
          return;
        }

        state.items = state.items.map((test) =>
          test._id === updatedQuestion.testId
            ? {
                ...test,
                questions: (test.questions ?? []).map((question) =>
                  question._id === updatedQuestion._id ? updatedQuestion : question
                ),
                totalMarks:
                  (test.questions ?? []).reduce((sum, q) => sum + (q._id === updatedQuestion._id ? Number(updatedQuestion.marks) : Number(q.marks) || 0), 0),
              }
            : test
        );
      })
      .addCase(updateTestQuestion.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not update question";
      })
      .addCase(updateTeacherTest.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateTeacherTest.fulfilled, (state, action) => {
        state.isSaving = false;
        const updatedTest = action.payload.data;

        if (!updatedTest?._id) {
          return;
        }

        state.items = state.items.map((test) =>
          test._id === updatedTest._id
            ? {
                ...test,
                ...updatedTest,
              }
            : test
        );
      })
      .addCase(updateTeacherTest.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not update test";
      })
      .addCase(deleteTeacherTest.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(deleteTeacherTest.fulfilled, (state, action) => {
        state.isSaving = false;
        const deletedTest = action.payload.data;

        if (!deletedTest?._id) {
          return;
        }

        state.items = state.items.filter((test) => test._id !== deletedTest._id);
      })
      .addCase(deleteTeacherTest.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error?.message || "Could not delete test";
      });
  },
});

export const { clearLatestCreatedTest } = testSlice.actions;
export { createTeacherTest, addTestQuestions, removeTestQuestion, updateTestQuestion, updateTeacherTest, deleteTeacherTest, fetchTeacherTests };
export default testSlice.reducer;
