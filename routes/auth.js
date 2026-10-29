
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, age, password } = req.body;

        if (!name || !email || age === undefined || !password) {
            return res.status(400).json({
                message: "Please provide name, email, age, and password."
            });
        }

        if (!Number.isFinite(Number(age)) || Number(age) < 1) {
            return res.status(400).json({
                message: "Age must be a valid positive number."
            });
        }

        if (String(password).length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });
        }

        const existingUser = await User.findOne({
            email: String(email).trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        const user = new User({
            name,
            email,
            age: Number(age),
            password
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully.",
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

        console.error("Registration error:", error.message);
        res.status(500).json({
            message: "Server error during registration."
        });
    }
});

// Log in an existing user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password."
            });
        }

        const user = await User.findOne({
            email: String(email).trim().toLowerCase()
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "Server error during login."
        });
    }
});

module.exports = router;
