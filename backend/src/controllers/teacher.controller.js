import mongoose from "mongoose";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { Submission } from "../models/submission.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const buildDetailedSubmission = async (submission) => {
  const questions = await Question.find({
    _id: { $in: submission.answers.map((answer) => answer.questionId) },
  });

  const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));

  const detailedAnswers = submission.answers.map((answer) => {
    const question = questionMap.get(answer.questionId.toString());

    return {
      ...answer.toObject(),
      question: question?.question,
      type: question?.type,
      options: question?.options,
      correctAnswer: question?.correctAnswer,
      marks: question?.marks,
    };
  });

  return {
    submission: submission.toObject(),
    answers: detailedAnswers,
  };
};

const getAllStudentResults = asyncHandler(async (req, res) => {
  const teacherTests = await Test.find({ createdBy: req.user._id }).select("_id");
  const teacherTestIds = teacherTests.map((test) => test._id);

  const results = await Submission.find({
    testId: { $in: teacherTestIds },
  })
    .populate("studentId", "fullName email")
    .populate("testId", "title subject duration startTime endTime")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Student results fetched successfully"));
});

const getSubmissionDetailsForTeacher = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new ApiError(400, "Invalid submission id");
  }

  const submission = await Submission.findById(submissionId).populate(
    "testId",
    "title subject duration startTime endTime createdBy"
  ).populate("studentId", "fullName email");

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  if (submission.testId?.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to review this submission");
  }

  const resultDetails = await buildDetailedSubmission(submission);

  return res
    .status(200)
    .json(new ApiResponse(200, resultDetails, "Submission details fetched successfully"));
});

const evaluateSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { answers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new ApiError(400, "Invalid submission id");
  }

  if (!Array.isArray(answers)) {
    throw new ApiError(400, "Answers array is required");
  }

  const submission = await Submission.findById(submissionId).populate(
    "testId",
    "createdBy"
  );

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  if (submission.testId?.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to review this submission");
  }

  const answerMap = new Map(
    answers.map((answer) => [answer.questionId?.toString(), Number(answer.marksObtained) || 0])
  );

  const questionIds = submission.answers.map((answer) => answer.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));

  let finalScore = 0;

  submission.answers.forEach((answer) => {
    const question = questionMap.get(answer.questionId.toString());
    if (!question) {
      return;
    }

    if (question.type === "written") {
      const marksObtained = Math.min(
        Math.max(answerMap.get(answer.questionId.toString()) || 0, 0),
        question.marks
      );
      answer.marksObtained = marksObtained;
      answer.isCorrect = false;
      finalScore += marksObtained;
      return;
    }

    finalScore += answer.marksObtained || 0;
  });

  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  const percentage = totalMarks > 0 ? (finalScore / totalMarks) * 100 : 0;

  submission.score = finalScore;
  submission.totalMarks = totalMarks;
  submission.percentage = Math.round(percentage * 100) / 100;
  submission.status = "evaluated";

  await submission.save();

  const resultDetails = await buildDetailedSubmission(submission);

  return res
    .status(200)
    .json(new ApiResponse(200, resultDetails, "Submission evaluated successfully"));
});

export {
  getAllStudentResults,
  getSubmissionDetailsForTeacher,
  evaluateSubmission,
};
