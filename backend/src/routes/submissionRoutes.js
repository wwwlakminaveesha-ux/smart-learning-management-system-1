import express from "express";

import {

submitAssignment,
getAssignmentSubmissions,
gradeSubmission,
getMySubmissions

}
from "../controllers/submissionController.js";

import {protect}
from "../middleware/authMiddleware.js";

import {authorizeRoles}
from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
"/",
protect,
authorizeRoles("student"),
submitAssignment
);

router.get(
"/assignment/:assignmentId",
protect,
authorizeRoles("lecturer"),
getAssignmentSubmissions
);

router.put(
"/grade/:id",
protect,
authorizeRoles("lecturer"),
gradeSubmission
);

router.get(
  "/my-submissions",
  protect,
  authorizeRoles("student"),
  getMySubmissions
);

export default router;