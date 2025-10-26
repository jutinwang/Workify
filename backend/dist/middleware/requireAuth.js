"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jwt_js_1 = require("../lib/jwt.js");
function requireAuth(req, res, next) {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) {
        return res.status(401).json({ error: "Missing or malformed token" });
    }
    try {
        const claims = (0, jwt_js_1.verifyToken)(token);
        req.user = claims;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Missing token" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
}
