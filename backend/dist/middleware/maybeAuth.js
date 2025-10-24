"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeAuth = maybeAuth;
const jwt_js_1 = require("../lib/jwt.js");
function maybeAuth(req, _res, next) {
    const h = req.header("authorization");
    const token = h?.startsWith("Bearer ") ? h.slice(7) : undefined;
    if (token) {
        try {
            req.user = (0, jwt_js_1.verifyToken)(token);
        }
        catch { }
    }
    next();
}
