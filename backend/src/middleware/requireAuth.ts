import { Request, Response, NextFunction } from "express";
import * as Prisma from "@prisma/client";
import { verifyToken, JwtClaims } from "../lib/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: JwtClaims;
        }
    }
}

type Role = Prisma.$Enums.Role;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();

    if (!token) {
        return res.status(401).json({ error: "Missing or malformed token" });
    }

    try {
        const claims = verifyToken(token);
        req.user = claims;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export function requireRole(...allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.role) {
            return res.status(401).json({ error: "Missing token" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: requires role ${allowedRoles.join(", ")}` });
        }

        next();
    };
}
