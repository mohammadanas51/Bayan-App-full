// E:\Code playground\Languages\Web\Bayan Management\Bayan Management Backend\src\middlewares\authmiddleware.js
const jwt = require("jsonwebtoken");

// Basic token verification
const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "Authorization denied due to lack of token" });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode; // { id, role }
            console.log("the decoded user is : ", req.user);
            next();
        } catch (error) {
            res.status(400).json({ message: "Token is not valid" });
        }
    } else {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }
};

// Middleware to restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }
        next();
    };
};

// Middleware to restrict Daiee to their own bayans
const restrictDaieeToOwnBayans = async (req, res, next) => {
    if (req.user.role !== "Daiee") {
        return next(); // Schedulers can proceed without restriction
    }

    try {
        const user = await require("../models/user").findById(req.user.id);
        const bayanDoc = await require("../models/bayan").findById(req.params.id);
        
        if (!bayanDoc) {
            return res.status(404).json({ message: "Bayan not found" });
        }

        const bayan = bayanDoc.bayans.find((b) => b._id.toString() === req.params.bayanId);
        if (!bayan) {
            return res.status(404).json({ message: "Specific bayan not found" });
        }

        if (bayan.speaker !== user.userName) {
            return res.status(403).json({ message: "You can only access bayans assigned to you" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error checking bayan ownership", error: error.message });
    }
};

module.exports = { verifyToken, restrictTo, restrictDaieeToOwnBayans };