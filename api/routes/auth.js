const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const router = express.Router();
const { generateTokenForUser } = require('../services/authentication');
const user = require('../models/user');


//Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                error: "Incorrect Username or Password!!"
            });
        }

        const Token = generateTokenForUser(user);

        res.cookie("token", Token);
        res.status(200).json({
            success: true,
            message: "Signin successful",
            user
        });

    } catch (error) {
        console.error("Signin error: ", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

//Register
router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const emailExist = await User.findOne({ email: email });
        const usernameExist = await User.findOne({ username: username });
        if (emailExist || usernameExist) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        });

        // Send JSON response indicating success
        res.status(201).json({ 
            success: true, 
            message: "Signup successful",
            user            
        });

    } catch (error) {
        console.error("Signup error: ", error);
        res.status(500).json({ error: "Internal server error!" });
    }
});

//Logout
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logging out error: ", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router