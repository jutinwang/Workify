import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:companyId", async (req, res, next) => {
    try {
        const companyId = Number(req.params.companyId);

        if (!Number.isFinite(companyId)) {
            return res.status(400).json({ error: "Invalid company ID" });
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: {
                id: true,
                name: true,
                url: true,
                size: true,
                about: true,
                careersPage: true,
                linkedInUrl: true,
            },
        });

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        return res.json({ company });
    } catch (e) {
        next(e);
    }
});

export default router;