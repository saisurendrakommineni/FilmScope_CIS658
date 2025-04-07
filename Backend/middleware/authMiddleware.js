const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    if (!token) return res.status(401).json({ message: "Unauthorized: Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //  Attach decoded user to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
