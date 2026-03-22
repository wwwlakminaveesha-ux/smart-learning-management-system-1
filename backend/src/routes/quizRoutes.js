import express from "express";
import {
    createQuiz,
    getModuleQuizzes,
    getQuizById,
    submitQuizAttempt,
    getQuizAttempts
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("lecturer"), createQuiz);
router.get("/module/:moduleId", protect, getModuleQuizzes);
router.get("/:id", protect, getQuizById);
router.post("/attempt", protect, authorizeRoles("student"), submitQuizAttempt);
router.get("/attempts/:quizId", protect, authorizeRoles("lecturer"), getQuizAttempts);

export default router;