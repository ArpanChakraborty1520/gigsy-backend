import User from "../models/user.model.js";
import createError from "../utils/createError.js";

// ✅ Delete User
export const deleteUser = async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return next(createError(403, "You can delete only your account!"));
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

// ✅ Get User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// ✅ Become a Seller
export const becomeSeller = async (req, res, next) => {
  try {
    // Ensure a user can only update their own account
    if (req.userId !== req.params.id) {
      return next(createError(403, "You can only update your own account"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isSeller: true },
      { new: true } // Return updated document
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};
