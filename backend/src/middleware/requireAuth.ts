import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import * as Prisma from "@prisma/client";
import { verifyToken, JwtClaims } from "../lib/jwt";

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: JwtClaims;
        }
    }
}

type Role = Prisma.$Enums.Role;

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();

    if (!token) {
        return res.status(401).json({ error: "Missing or malformed token" });
    }

    try {
        const claims = verifyToken(token);
        
        // Check if user is suspended
        const user = await prisma.user.findUnique({
            where: { id: claims.sub },
            select: { suspended: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        if (user.suspended) {
            return res.status(403).json({ error: "Account suspended. Please contact support." });
        }

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