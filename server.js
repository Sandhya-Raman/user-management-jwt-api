
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

// Welcome route
app.get("/", (req, res) => {
    res.json({
        message: "User Management API with JWT Authentication is running!"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected user-management routes
app.use("/api/users", userRoutes);

// Start the server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
