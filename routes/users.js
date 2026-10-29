
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below require JWT authentication
router.use(authMiddleware);

// GET: View the logged-in user's details
router.get("/me", async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user."
        });
    }
});

// GET: View all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password");

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve users."
        });
    }
});

// GET: View a user by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user."
        });
    }
});

// PUT: Update the logged-in user's details
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        // Users can update only their own account
        if (req.params.id !== req.userId) {
            return res.status(403).json({
                message: "You can update only your own account."
            });
        }

        const { name, email, age, password } = req.body;
        const updates = {};

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Name must not be empty."
                });
            }
            updates.name = name.trim();
        }

        if (email !== undefined) {
            if (typeof email !== "string" || !email.trim()) {
                return res.status(400).json({
                    message: "Email must not be empty."
                });
            }
            updates.email = email.trim().toLowerCase();
        }

        if (age !== undefined) {
            if (
                age === "" ||
                !Number.isFinite(Number(age)) ||
                Number(age) < 1
            ) {
                return res.status(400).json({
                    message: "Age must be a valid positive number."
                });
            }
            updates.age = Number(age);
        }

        if (password !== undefined) {
            if (typeof password !== "string" || password.length < 6) {
                return res.status(400).json({
                    message: "Password must contain at least 6 characters."
                });
            }
            updates.password = password;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Please provide at least one field to update."
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        Object.assign(user, updates);
        await user.save();

        res.status(200).json({
            message: "User updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        res.status(500).json({
            message: "Failed to update user."
        });
    }
});

// DELETE: Delete the logged-in user's account
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        // Users can delete only their own account
        if (req.params.id !== req.userId) {
            return res.status(403).json({
                message: "You can delete only your own account."
            });
        }

        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            message: "User deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user."
        });
    }
});

module.exports = router;
