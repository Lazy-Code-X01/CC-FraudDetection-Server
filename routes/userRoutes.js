import express from "express";
import {
	authUser,
	registerUser,
	logoutUser,
	validateCard,
	sendToken,
} from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/send-token", sendToken);
router.post("/validate-card", validateCard);
router.post("/logout", logoutUser);

export default router;
