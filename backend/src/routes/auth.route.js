import express from "express";
import { login, logout, me, onboard, signup, testing } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", testing);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

//check if user is loggin or not ?
router.get("/me", protectRoute, me);

export default router;