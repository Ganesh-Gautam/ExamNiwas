import mongoose from "mongoose";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { Submission } from "../models/submission.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
export {getAllStudentResults};
