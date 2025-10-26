"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET ?? "dev-secret";
function signToken(claims, ttl = "7d") {
    return jsonwebtoken_1.default.sign(claims, SECRET, { expiresIn: ttl, algorithm: "HS256" });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, SECRET, { algorithms: ["HS256"] });
}
