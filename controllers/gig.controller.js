import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

/**
 * ✅ Create a new gig
 */
export const createGig = async (req, res, next) => {
  try {
    const newGig = new Gig({
      userId: req.userId,
      ...req.body,
    });

    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    console.error("Error creating gig:", err);
    next(createError(500, "Failed to create gig"));
  }
};

/**
 * ✅ Delete gig (only owner can delete)
 */
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() !== req.userId)
      return next(createError(403, "You can only delete your own gigs"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (err) {
    next(createError(500, "Failed to delete gig"));
  }
};

/**
 * ✅ Get single gig by ID (populate user data)
 */
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("userId", "username img country desc");

    if (!gig) return next(createError(404, "Gig not found"));

    res.status(200).json(gig);
  } catch (err) {
    next(createError(500, "Failed to fetch gig"));
  }
};

/**
 * ✅ Get all gigs with filters + populate user data
 */
export const getGigs = async (req, res, next) => {
  try {
    const filters = {};

    // Category filter
    if (req.query.cat) {
      filters.cat = req.query.cat;
    }

    // Min/max price filter
    if (req.query.min || req.query.max) {
      filters.price = {};
      if (req.query.min) filters.price.$gte = parseInt(req.query.min);
      if (req.query.max) filters.price.$lte = parseInt(req.query.max);
    }

    // Text search
    if (req.query.search) {
      filters.title = { $regex: req.query.search, $options: "i" };
    }

    // Sort option
    let sortOption = {};
    if (req.query.sort === "sales") {
      sortOption = { sales: -1 };
    } else if (req.query.sort === "createdAt") {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { _id: -1 }; // Default: newest
    }

    // ✅ Fetch gigs + populate user info
    const gigs = await Gig.find(filters)
      .populate("userId", "username img")
      .sort(sortOption)
      .exec();

    res.status(200).json(gigs);
  } catch (err) {
    console.error("Error fetching gigs:", err);
    next(createError(500, "Failed to fetch gigs"));
  }
};
