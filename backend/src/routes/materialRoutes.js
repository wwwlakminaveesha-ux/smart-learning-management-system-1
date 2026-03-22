import express from "express";

import {
uploadMaterial,
getModuleMaterials
} from "../controllers/materialController.js";

import {protect} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
"/",
protect,
authorizeRoles("lecturer"),
uploadMaterial
);

router.get(
"/module/:moduleId",
protect,
getModuleMaterials
);

export default router;