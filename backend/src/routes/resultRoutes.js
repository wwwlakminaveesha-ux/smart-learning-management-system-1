import express from "express";
import {
    publishStudentModuleResult,
    getStudentResults,
    getModuleResultsForLecturer
} from "../controllers/resultController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/publish", protect, authorizeRoles("lecturer"), publishStudentModuleResult);
router.get("/my-results", protect, authorizeRoles("student"), getStudentResults);
router.get("/module/:moduleId", protect, authorizeRoles("lecturer"), getModuleResultsForLecturer);

export default router;