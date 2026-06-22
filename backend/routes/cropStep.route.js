// routes/cropStepRoutes.js
import express from "express";
import { getAllCrops, getCropById } from "../controllers/cropStep.controller.js";

const router = express.Router();

router.get("/:cropId", getCropById);
router.get("/", getAllCrops);


export default router;
