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

// Middleware that only checks authentication and suspension, not employer approval
// Use this for endpoints that unapproved employers need to access (e.g., complete-profile)
export async function requireAuthOnly(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();

    if (!token) {
        return res.status(401).json({ error: "Missing or malformed token" });
    }

    try {
        const claims = verifyToken(token);
        
        // Convert sub to number (JWT stores it as string)
        const userId = typeof claims.sub === 'string' ? parseInt(claims.sub, 10) : claims.sub;
        
        // Check if user is suspended (but don't check employer approval)
        const user = await prisma.user.findUnique({
            where: { id: userId },
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

// Full authentication middleware that also checks employer approval status
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();

    if (!token) {
        return res.status(401).json({ error: "Missing or malformed token" });
    }

    try {
        const claims = verifyToken(token);
        
        // Convert sub to number (JWT stores it as string)
        const userId = typeof claims.sub === 'string' ? parseInt(claims.sub, 10) : claims.sub;
        
        // Check if user is suspended or employer is not approved
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { 
                suspended: true, 
                role: true,
                employer: {
                    select: { approved: true }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        if (user.suspended) {
            return res.status(403).json({ error: "Account suspended. Please contact support." });
        }

        // Block unapproved employers from accessing the platform
        if (user.role === "EMPLOYER" && user.employer && !user.employer.approved) {
            return res.status(403).json({ error: "Your employer account is pending approval. Please wait for admin approval." });
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