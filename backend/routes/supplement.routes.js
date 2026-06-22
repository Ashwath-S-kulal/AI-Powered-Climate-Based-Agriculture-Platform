// routes/supplementRoutes.js
import express from "express";
import { getSupplements } from "../controllers/supplement.controller.js";

const router = express.Router();

router.get("/supplimentdata", getSupplements);

export default router;
