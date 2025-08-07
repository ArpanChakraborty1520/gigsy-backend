import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

/**
 * ✅ Create a gig
 * - If user is logged in, they can create a gig directly
 * - Works for all users (seller check removed for simplicity)
 */
router.post("/", verifyToken, createGig);

/**
 * ✅ Delete gig (only by owner)
 */
router.delete("/:id", verifyToken, deleteGig);

/**
 * ✅ Get single gig by ID
 */
router.get("/single/:id", getGig);

/**
 * ✅ Get all gigs (or filter by query)
 */
router.get("/", getGigs);

export default router;
