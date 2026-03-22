import express from "express";

import {
getSystemStats
}
from "../controllers/reportController.js";

import {protect}
from "../middleware/authMiddleware.js";

import {authorizeRoles}
from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
"/system",
protect,
authorizeRoles("admin"),
getSystemStats
);

export default router;