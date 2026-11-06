
import express from "express";
import authenticate from "../middleware/middleware.js";
import authorize from "../middleware/rolemiddleware.js";
import { deleteAuction, createAuction, getAuctions, getAuctionById, updateAuction } from "../controllers/auctionController.js";
import upload from "../middleware/uploadmiddleware.js"
const router = express.Router();
router.get("/", getAuctions);
router.get("/:id",getAuctionById)
router.post("/",authenticate,authorize(["Seller", "Admin"]), upload.array("images",5), createAuction);
router.put("/:id",authenticate,authorize(["Seller", "Admin"]), updateAuction )
router.delete("/:id", authenticate,authorize(["Seller","Admin"]),deleteAuction)
export default router;
