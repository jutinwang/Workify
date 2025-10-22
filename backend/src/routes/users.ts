import { Router, type Request, type Response } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import bcrypt from "bcrypt";

