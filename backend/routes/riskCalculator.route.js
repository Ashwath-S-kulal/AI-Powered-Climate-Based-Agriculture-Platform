import express from "express";
import { riskCalculater } from "../controllers/riskCalculator.controller.js";

const router = express.Router();

router.post("/riskcalculater", riskCalculater);

export default router;
