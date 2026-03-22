import express from "express";

import {

getUsers,
getUserStats,
updateUserRole,
updateUser,
deactivateUser

}

from "../controllers/userController.js";

import {

protect

}

from "../middleware/authMiddleware.js";

import {

authorizeRoles

}

from "../middleware/roleMiddleware.js";


const router = express.Router();


// ADMIN ONLY

router.get(
"/",
protect,
authorizeRoles("admin"),
getUsers
);


router.get(
"/stats",
protect,
authorizeRoles("admin"),
getUserStats
);


router.put(
"/role/:id",
protect,
authorizeRoles("admin"),
updateUserRole
);


router.put(
"/:id",
protect,
authorizeRoles("admin"),
updateUser
);


router.put(
"/deactivate/:id",
protect,
authorizeRoles("admin"),
deactivateUser
);


export default router;