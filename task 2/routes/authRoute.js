import express from "express";
import middleware from "../Middleware/middleware.js";
import { register, login, profile } from "../controllers/userController.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile",middleware,profile)
export default router;