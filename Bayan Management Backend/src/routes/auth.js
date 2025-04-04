const express = require("express");
const bcrypt  = require("bcrypt");
const User = require("../models/user");
const router = express.Router() ;
const jwt = require("jsonwebtoken");

// Signup Route 
router.post("/signup",async(req,res)=>{
    const { userName , password , role } = req.body ; 
    console.log("Signup request received:", { userName, role });
    try {
        const exisitingUser = await User.findOne({ userName });
        if(exisitingUser){
            return res.status(400).json({ message : "User already registered"});
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = new User ({ userName , password : hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message : "User created Successfully"});
    } catch (error) {
        console.log(error);
        console.log("Signup error:", error.message); // More specific error logging
        console.log("Stack trace:", error.stack);
        res.status(500).json({ message : "Server error during signup",error: error.message });
    }
});


// Login Route 
router.post("/login", async (req, res) => {
    const { userName, password } = req.body;

    // Input Validation: Check for missing fields
    if (!userName || !password) {
        return res.status(400).json({ message: "Username and Password are required" });
    }

    try {
        // Check if the user exists in the database
        console.log("Querying user:", userName);
        const user = await User.findOne({ userName });
        console.log("Query result:", user);
        if (!user) {
            return res.status(400).json({ message: "Invalid Username" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            {id : user._id, role : user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        // Respond with success if credentials are valid
        res.status(200).json({ 
            message: "Login Successful", 
            user: { _id: user._id, userName: user.userName, role: user.role }, 
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error during login" , error: error.message });
    }
});


module.exports = router ; 
