import { Router } from "express";
import {
  getAvailableTests,
  getTestQuestions,
  submitAnswers,
  getStudentTestResult,
  getStudentResults,
  getSubmissionDetails,
  cleanupDuplicateSubmissions,
} from "../controllers/student.controller.js";
import { requireStudent, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireStudent);

router.route("/tests").get(getAvailableTests);
router.route("/tests/:testId/questions").get(getTestQuestions);
router.route("/tests/:testId/submit").post(submitAnswers);
router.route("/tests/:testId/result").get(getStudentTestResult);
router.route("/tests/results").get(getStudentResults);
router.route("/submissions/:submissionId").get(getSubmissionDetails); 
router.route("/debug/cleanup-submissions").post(cleanupDuplicateSubmissions);

export default router;
