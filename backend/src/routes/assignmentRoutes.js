import express from "express";

import {
createAssignment,
getModuleAssignments
}
from "../controllers/assignmentController.js";

import {protect}
from "../middleware/authMiddleware.js";

import {authorizeRoles}
from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
"/",
protect,
authorizeRoles("lecturer"),
createAssignment
);

router.get(
"/module/:moduleId",
protect,
getModuleAssignments
);

export default router;