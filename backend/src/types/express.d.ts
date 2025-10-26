import "express";

declare global {
    namespace Express {
        interface User {
            id: number;
            role: "STUDENT" | "EMPLOYER" | "ADMIN";
            email?: string;
            name?: string;
        }
        interface Request {
            user?: User; 
        }
    }
}