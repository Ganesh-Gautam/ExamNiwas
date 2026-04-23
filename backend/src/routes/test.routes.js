import { Router } from "express";
import { addQuestions, createTest, getTeacherTests, removeQuestion, updateQuestion, updateTest, deleteTest } from "../controllers/test.controller.js";
import { requireTeacher, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireTeacher);

router.route("/").post(createTest).get(getTeacherTests);
router.route("/:testId").put(updateTest).delete(deleteTest);
router.route("/:testId/questions").post(addQuestions);
router.route("/:testId/questions/:questionId").put(updateQuestion).delete(removeQuestion);

export default router;
