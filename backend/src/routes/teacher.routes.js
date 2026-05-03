import { Router } from "express";
import {
  getAllStudentResults
} from "../controllers/teacher.controller.js";
import { requireTeacher, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireTeacher); 
router.route("/tests/results").get(getAllStudentResults); 

export default router;
