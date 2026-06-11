import mongoose from "mongoose";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { Submission } from "../models/submission.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const shuffleArray = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

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

const getAvailableTests = asyncHandler(async (req, res) => {
  const now = new Date();

  const tests = await Test.aggregate([
    {
      $match: {
        startTime: { $lte: now },
        endTime: { $gte: now },
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
            $count: "totalQuestions",
          },
        ],
        as: "questionStats",
      },
    },
    {
      $lookup: {
        from: "submissions",
        let: { testId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$testId", "$$testId"] },
                  { $eq: ["$studentId", new mongoose.Types.ObjectId(req.user._id)] },
                ],
              },
            },
          },
        ],
        as: "submission",
      },
    },
    {
      $addFields: {
        totalQuestions: {
          $arrayElemAt: ["$questionStats.totalQuestions", 0],
        },
        isAttempted: { $gt: [{ $size: "$submission" }, 0] },
        totalMarks: {
          $sum: {
            $map: {
              input: "$submission",
              as: "sub",
              in: "$$sub.score",
            },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        subject: 1,
        duration: 1,
        startTime: 1,
        endTime: 1,
        totalQuestions: 1,
        isAttempted: 1,
        totalMarks: 1,
        negativeMarkingEnabled: 1,
        negativeMarkingValue: 1,
        randomizeQuestions: 1,
      },
    },
    {
      $sort: {
        startTime: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, tests, "Available tests fetched successfully")
    );
});

const getTestQuestions = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }
 
  const now = new Date();
  if (now < test.startTime) {
    throw new ApiError(403, "Test has not started yet");
  }

  if (now > test.endTime) {
    throw new ApiError(403, "Test has ended");
  }

  const existingSubmission = await Submission.findOne({
    studentId: req.user._id,
    testId,
  });

  if (existingSubmission) {
    throw new ApiError(403, "You have already submitted this test");
  }

  const questions = await Question.find({ testId }).select({
    question: 1,
    options: 1,
    marks: 1,
    type: 1,
  });
  const orderedQuestions = test.randomizeQuestions ? shuffleArray(questions) : questions;

  const questionsWithoutAnswers = orderedQuestions.map((q) => ({
    _id: q._id,
    question: q.question,
    type: q.type,
    options: q.options,
    marks: q.marks,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          test: {
            _id: test._id,
            title: test.title,
            subject: test.subject,
            duration: test.duration,
            totalQuestions: orderedQuestions.length,
            totalMarks: orderedQuestions.reduce((sum, q) => sum + q.marks, 0),
            negativeMarkingEnabled: test.negativeMarkingEnabled,
            negativeMarkingValue: test.negativeMarkingValue,
            randomizeQuestions: test.randomizeQuestions,
          },
          questions: questionsWithoutAnswers,
        },
        "Test questions fetched successfully"
      )
    );
});

const submitAnswers = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { answers, timeTaken } = req.body;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }

  if (!Array.isArray(answers)) {
    throw new ApiError(400, "Answers array is required");
  }

  if (timeTaken === undefined || timeTaken === null) {
    throw new ApiError(400, "Time taken is required");
  }

  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  // Check if test is still within time limit
  const now = new Date();
  if (now > test.endTime) {
    throw new ApiError(403, "Test has ended");
  }
 
  const maxAllowedSeconds = test.duration * 60;
  const timeTakenSeconds = Number(timeTaken);
 
  const toleranceSeconds = 5;
  if (timeTakenSeconds > maxAllowedSeconds + toleranceSeconds) {
    throw new ApiError(
      408,
      `Submission time exceeded. Test duration: ${test.duration} minutes. Time taken: ${Math.floor(timeTakenSeconds / 60)} minutes ${timeTakenSeconds % 60} seconds.`
    );
  }

  const existingSubmission = await Submission.findOne({
    studentId: req.user._id,
    testId,
  });

  if (existingSubmission) {
    throw new ApiError(409, "You have already submitted this test");
  } 
  const allQuestions = await Question.find({ testId });
  const submittedAnswerMap = new Map(
    answers.map((answer) => [answer.questionId?.toString(), answer])
  );

  let totalScore = 0;
  let totalMarks = 0;
  let hasWrittenQuestion = false;
  const processedAnswers = [];

  for (const question of allQuestions) {
    totalMarks += question.marks;
    const submittedAnswer = submittedAnswerMap.get(question._id.toString()) || {};

    if (question.type === "written") {
      hasWrittenQuestion = true;
      const answerText = String(submittedAnswer.answerText || "").trim();

      processedAnswers.push({
        questionId: question._id,
        answerText,
        selectedAnswer: "",
        isCorrect: false,
        marksObtained: 0,
      });
      continue;
    }

    const selectedAnswer = String(submittedAnswer.selectedAnswer || "").trim();
    const isCorrect = question.correctAnswer === selectedAnswer;
    const wasAnswered = Boolean(selectedAnswer);
    const negativePenalty =
      test.negativeMarkingEnabled && wasAnswered && !isCorrect
        ? Math.min(Number(test.negativeMarkingValue) || 0, Number(question.marks) || 0)
        : 0;
    const marksObtained = isCorrect ? question.marks : -negativePenalty;
    totalScore += marksObtained;

    processedAnswers.push({
      questionId: question._id,
      selectedAnswer,
      answerText: "",
      isCorrect,
      marksObtained,
    });
  }

  const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
  const status = hasWrittenQuestion ? "submitted" : "evaluated";
  const message = hasWrittenQuestion
    ? "Test submitted successfully. Written answers will be graded by your teacher."
    : "Answers submitted and evaluated successfully";

  let submission;

  try {
    submission = await Submission.create({
      studentId: req.user._id,
      testId,
      answers: processedAnswers,
      score: totalScore,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      timeTaken: Number(timeTaken) || 0,
      status,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(409, "You have already submitted this test");
    }

    throw error;
  }

  const populatedSubmission = await Submission.findById(submission._id).populate(
    "testId",
    "title subject duration negativeMarkingEnabled negativeMarkingValue randomizeQuestions"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedSubmission,
        message
      )
    );
});

const getStudentTestResult = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    throw new ApiError(400, "Invalid test id");
  }
 
  const submission = await Submission.findOne({
    studentId: req.user._id,
    testId,
  })
    .populate("testId", "title subject duration startTime endTime negativeMarkingEnabled negativeMarkingValue randomizeQuestions")
    .sort({ createdAt: -1 });

  if (!submission) {
    throw new ApiError(404, "Result not found for this test");
  }

  const resultDetails = await buildDetailedSubmission(submission);

  return res
    .status(200)
    .json(
      new ApiResponse(200, resultDetails, "Student test result fetched successfully")
    );
});


const getStudentResults = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ studentId: req.user._id })
    .populate("testId", "title subject duration totalMarks negativeMarkingEnabled negativeMarkingValue randomizeQuestions")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Student results fetched successfully")
    );
});


const getSubmissionDetails = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new ApiError(400, "Invalid submission id");
  }

  const submission = await Submission.findOne({
    _id: submissionId,
    studentId: req.user._id,
  }).populate("testId", "title subject duration negativeMarkingEnabled negativeMarkingValue randomizeQuestions");

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  const resultDetails = await buildDetailedSubmission(submission);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resultDetails,
        "Submission details fetched successfully"
      )
    );
});
 
const cleanupDuplicateSubmissions = asyncHandler(async (req, res) => { 
  const submissions = await Submission.find().sort({ studentId: 1, testId: 1, createdAt: -1 });

  const seen = new Map();
  const idsToDelete = [];

  for (const submission of submissions) {
    const key = `${submission.studentId.toString()}_${submission.testId.toString()}`;

    if (seen.has(key)) { 
      idsToDelete.push(submission._id);
    } else { 
      seen.set(key, submission._id);
    }
  }

  if (idsToDelete.length > 0) {
    await Submission.deleteMany({ _id: { $in: idsToDelete } });
    return res.status(200).json(
      new ApiResponse(200, { deletedCount: idsToDelete.length }, `Cleaned up ${idsToDelete.length} duplicate submissions`)
    );
  }

  return res.status(200).json(new ApiResponse(200, { deletedCount: 0 }, "No duplicate submissions found"));
});

export {
  getAvailableTests,
  getTestQuestions,
  submitAnswers,
  getStudentTestResult,
  getStudentResults,
  getSubmissionDetails,
  cleanupDuplicateSubmissions,
};
