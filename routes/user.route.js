import express from "express";
import { deleteUser, getUser, becomeSeller } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// ✅ Delete a user (Only owner can delete)
router.delete("/:id", verifyToken, deleteUser);

// ✅ Get a user by ID
router.get("/:id", getUser);

// ✅ Update user to become a seller (Protected Route)
router.put("/become-seller/:id", verifyToken, becomeSeller);

export default router;
