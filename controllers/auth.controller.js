import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    // Hash password
    const hash = bcrypt.hashSync(req.body.password, 10);

    // Create new user
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).json({ message: "✅ User has been created successfully." });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Login user and issue JWT token
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    // Check if user exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    // Verify password
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong password or username!"));

    // Verify JWT key
    const secretKey = process.env.JWT_KEY;
    if (!secretKey) {
      return next(createError(500, "Server configuration error: JWT key is missing!"));
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      secretKey,
      { expiresIn: "7d" } // ✅ Token expires in 7 days
    );

    // Exclude password before sending user data
    const { password, ...info } = user._doc;

    // Send token in HTTP-only cookie
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "strict", // Helps prevent CSRF
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "✅ Login successful",
        user: info,
        token, // Optional: you can remove this if you only want to store in cookies
      });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Logout user and clear token cookie
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "✅ User has been logged out successfully." });
};
