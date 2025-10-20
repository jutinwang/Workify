import { verifyToken } from "../lib/jwt.js";

export function maybeAuth(req: any, _res: any, next: any) {
    const h = req.header("authorization");
    const token = h?.startsWith("Bearer ") ? h.slice(7) : undefined;
    if (token) {
        try { req.user = verifyToken(token); } catch {}
    }
    next();
}