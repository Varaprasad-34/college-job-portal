const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { validateCollegeEmail } = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user with college email
// @access  Public
router.post(
  "/register",
  [
    validateCollegeEmail,
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2-50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["student", "alumni"])
      .withMessage("Role must be either student or alumni"),
    body("major").trim().isLength({ min: 2 }).withMessage("Major is required"),
    body("graduationYear")
      .optional()
      .isInt({ min: 1970, max: new Date().getFullYear() }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, major, graduationYear, bio } =
        req.body;
        
      // Role-based email domain validation
      if (role === "student" && !email.endsWith("@cmrec.ac.in")) {
        return res
          .status(400)
          .json({
            message: "Students must register with a @cmrec.ac.in email",
          });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      // Validate graduation year for alumni
      if (role === "alumni" && !graduationYear) {
        return res
          .status(400)
          .json({ message: "Graduation year is required for alumni" });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        role,
        major,
        graduationYear: role === "alumni" ? graduationYear : undefined,
        bio,
        emailVerificationToken: crypto.randomBytes(32).toString("hex"),
      });

      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          major: user.major,
          graduationYear: user.graduationYear,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);




// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Update last active
      user.lastActive = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          major: user.major,
          graduationYear: user.graduationYear,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// password reset routes
router.put(
  '/change-password',
  [
    auth,
    body('currentPassword').exists().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id).select('+password');
      
      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: 'Server error during password change' });
    }
  }
);
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  [
    auth,
    body("name").optional().trim().isLength({ min: 2, max: 50 }),
    body("bio").optional().isLength({ max: 500 }),
    body("skills").optional().isArray(),
    body("experience").optional().isIn(["0-1", "1-3", "3-5", "5-10", "10+"]),
    body("currentPosition").optional().trim(),
    body("company").optional().trim(),
    body("linkedinProfile")
      .optional()
      .matches(/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      });

      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Server error during profile update" });
    }
  }
);

module.exports = router;
