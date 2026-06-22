import express from "express";
import { createPrediction, getPredictions,deletePrediction, predictDisease, clearPredictionHistory } from "../controllers/prediction.Controller.js";
import multer from "multer";
const upload = multer();
const router = express.Router();

router.post("/predict",upload.single("image") ,predictDisease);
router.post("/createPrediction/:id", createPrediction);
router.get("/getPredictions/:id", getPredictions);
router.delete("/deletePrediction/:id", deletePrediction);
router.delete("/clearPrediction/:id", clearPredictionHistory);


export default router;
