import express from "express";
import {
    createModule,
    getModules,
    updateModule,
    enrollStudentsToModule,
    deleteModule,
    getLecturerModules,
    getStudentModules,
    getModuleById
} from "../controllers/moduleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// admin routes
router.post("/", protect, authorizeRoles("admin"), createModule);
router.get("/", protect, authorizeRoles("admin"), getModules);
router.put("/:id", protect, authorizeRoles("admin"), updateModule);
router.put("/:id/enroll-students", protect, authorizeRoles("admin"), enrollStudentsToModule);
router.delete("/:id", protect, authorizeRoles("admin"), deleteModule);

// lecturer routes
router.get("/lecturer/my-modules", protect, authorizeRoles("lecturer"), getLecturerModules);

// student routes
router.get("/student/my-modules", protect, authorizeRoles("student"), getStudentModules);

// shared route
router.get("/:id", protect, getModuleById);

export default router;