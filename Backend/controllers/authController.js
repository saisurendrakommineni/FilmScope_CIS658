const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

console.log("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD);

const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL.toLowerCase(), 
    password: process.env.ADMIN_PASSWORD
};


// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const normalizedEmail = email.toLowerCase(); 

    try 
    {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const newUser = new User({
            firstName,
            lastName,
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        await newUser.save();
        const token = generateToken(newUser);

        res.status(201).json({
            message: "User registered successfully",
            token,
            role: "user",
            user: { firstName, lastName, email: normalizedEmail, role: "user" }
        });
    } 
    catch (err) 
    {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password, role } = req.body; 
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        if (role !== "admin") { 
            return res.status(403).json({ message: "Invalid email or password." });
        }
        const adminUser = {
            _id: "admin_id",
            email: ADMIN_CREDENTIALS.email,
            role: "admin"
        };
        const token = generateToken(adminUser);
        return res.json({ token, role: "admin", user: { firstName: "Admin", email: ADMIN_CREDENTIALS.email, role: "admin" } });
    }

    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: `Incorrect role! You are registered as ${user.role.toUpperCase()}.` });
        }

        const token = generateToken(user);

        res.json({
            token,
            role: user.role,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } 
    catch (err) 
    {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return `Password should be at least ${minLength} characters long`;
    if (!hasUpperCase) return "Password should contain at least one uppercase letter";
    if (!hasLowerCase) return "Password should contain at least one lowercase letter";  
    if (!hasNumber) return "Password should contain at least one number";
    if (!hasSpecialChar) return "Password should contain at least one special character";

    return null;
};


exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === ADMIN_CREDENTIALS.email) {
        return res.status(403).json({ message: "Admin password cannot be reset this way." });
    }

    const passwordError = isPasswordStrong(newPassword.trim());
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    try 
    {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        user.password = await bcrypt.hash(newPassword.trim(), 10);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } 
    catch (error) 
    {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.checkEmailExists = async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === ADMIN_CREDENTIALS.email) {
        return res.status(403).json({ message: "Admin password cannot be reset this way." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Email exists" });
};
