import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
import * as Prisma from "@prisma/client";

const SECRET: Secret = process.env.JWT_SECRET ?? "dev-secret";

export type Role = Prisma.$Enums.Role;

export type JwtClaims = JwtPayload & {
    sub: number;
    email: string;
    role: Role;
};

export function signToken(
    claims: Omit<JwtClaims, "iat" | "exp">,
    ttl: SignOptions["expiresIn"] = "7d"
): string {
    return jwt.sign(claims, SECRET, { expiresIn: ttl, algorithm: "HS256" });
}

export function verifyToken(token: string): JwtClaims {
    return jwt.verify(token, SECRET, { algorithms: ["HS256"] }) as JwtClaims;
}
