import mongoose from "mongoose";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTest = asyncHandler(async (req, res) => {
  const { title, subject, duration, startTime, endTime } = req.body; 

  if (!title || !subject || !duration || !startTime || !endTime) {
    throw new ApiError(400, "All test fields are required");
  }

  const test = await Test.create({
    title: title.trim(),
    subject: subject.trim(),
    duration: Number(duration),
    createdBy: req.user._id,
    startTime,
    endTime,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, test, "Test created successfully"));
});

const addQuestions = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { questions } = req.body;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new ApiError(400, "At least one question is required");
  }

  const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
  if (!test) {
    throw new ApiError(404, "Test not found for this teacher");
  }

  const preparedQuestions = questions.map((questionItem) => ({
    testId,
    type: questionItem.type === "written" ? "written" : "mcq",
    question: questionItem.question?.trim(),
    options:
      questionItem.type === "mcq" && Array.isArray(questionItem.options)
        ? questionItem.options
        : [],
    correctAnswer:
      questionItem.type === "mcq" ? questionItem.correctAnswer?.trim() : undefined,
    marks: Number(questionItem.marks),
  }));

  try {
    const createdQuestions = await Question.insertMany(preparedQuestions, { ordered: true });

    return res
      .status(201)
      .json(new ApiResponse(201, createdQuestions, "Questions added successfully"));
  } catch (error) {
    // Handle validation errors from MongoDB
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      throw new ApiError(400, `Validation error: ${errorMessages}`);
    }
 
    if (error.code === 11000) {
      throw new ApiError(400, "Duplicate entry detected");
    } 
    throw error;
  }
});

const getTeacherTests = asyncHandler(async (req, res) => {
  const tests = await Test.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "questions",
        let: { testId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$testId", "$$testId"],
              },
            },
          },
          {
            $sort: {
              createdAt: 1,
            },
          },
        ],
        as: "questions",
      },
    },
    {
      $addFields: {
        questionCount: { $size: "$questions" },
        totalMarks: { $sum: "$questions.marks" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tests, "Teacher tests fetched successfully"));
});

const removeQuestion = asyncHandler(async (req, res) => {
  const { testId, questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(400, "Invalid question id");
  }

  const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
  if (!test) {
    throw new ApiError(404, "Test not found for this teacher");
  }

  const deletedQuestion = await Question.findOneAndDelete({
    _id: questionId,
    testId,
  });

  if (!deletedQuestion) {
    throw new ApiError(404, "Question not found for this test");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedQuestion, "Question removed successfully"));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { testId, questionId } = req.params;
  const { type, question, options, correctAnswer, marks } = req.body;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(400, "Invalid question id");
  }

  const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
  if (!test) {
    throw new ApiError(404, "Test not found for this teacher");
  }

  const updatedQuestion = await Question.findOneAndUpdate(
    { _id: questionId, testId },
    {
      type: type === "written" ? "written" : "mcq",
      question: question?.trim(),
      options:
        type === "mcq" && Array.isArray(options) ? options : [],
      correctAnswer: type === "mcq" ? correctAnswer?.trim() : undefined,
      marks: Number(marks),
    },
    { returnDocument: "after", runValidators: true }
  );

  if (!updatedQuestion) {
    throw new ApiError(404, "Question not found for this test");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedQuestion, "Question updated successfully"));
});

const updateTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { title, subject, duration, startTime, endTime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  if (!title && !subject && !duration && !startTime && !endTime) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
  if (!test) {
    throw new ApiError(404, "Test not found for this teacher");
  }

  const updateData = {};
  if (title) updateData.title = title.trim();
  if (subject) updateData.subject = subject.trim();
  if (duration) updateData.duration = Number(duration);
  if (startTime) updateData.startTime = startTime;
  if (endTime) updateData.endTime = endTime;

  const updatedTest = await Test.findByIdAndUpdate(
    testId,
    updateData,
    { returnDocument: "after", runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTest, "Test updated successfully"));
});

const deleteTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
  if (!test) {
    throw new ApiError(404, "Test not found for this teacher");
  }

  // Delete all questions associated with this test
  await Question.deleteMany({ testId });

  // Delete the test
  const deletedTest = await Test.findByIdAndDelete(testId);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTest, "Test deleted successfully"));
});

export { createTest, addQuestions, getTeacherTests, removeQuestion, updateQuestion, updateTest, deleteTest };
