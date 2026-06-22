import express from "express";
import { getAllDiseases } from "../controllers/cropdisease.controller.js";

const router = express.Router();

router.get("/", getAllDiseases);

export default router;
