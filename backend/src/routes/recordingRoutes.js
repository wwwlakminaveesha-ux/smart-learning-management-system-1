import express from "express";

import {
addRecording,
getModuleRecordings
} from "../controllers/recordingController.js";

import {protect} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
"/",
protect,
authorizeRoles("lecturer"),
addRecording
);

router.get(
"/module/:moduleId",
protect,
getModuleRecordings
);

export default router;