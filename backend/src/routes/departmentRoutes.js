import express from "express";
import {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment
} from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createDepartment);
router.get("/", protect, authorizeRoles("admin"), getDepartments);
router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

export default router;