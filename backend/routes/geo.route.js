import express from "express";
import { explainChartData } from "../controllers/geo.controller.js";
const router = express.Router();

router.post("/explain-telemetry", explainChartData);


export default router;
