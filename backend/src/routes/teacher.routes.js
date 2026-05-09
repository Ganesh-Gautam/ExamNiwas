import { Router } from "express";
import {
  getAllStudentResults,
  getSubmissionDetailsForTeacher,
  evaluateSubmission,
} from "../controllers/teacher.controller.js";
import { requireTeacher, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireTeacher);
router.route("/tests/results").get(getAllStudentResults);
router.route("/submissions/:submissionId").get(getSubmissionDetailsForTeacher);
router.route("/submissions/:submissionId/evaluate").put(evaluateSubmission);

export default router;
