import express from 'express';
import { getWeatherAdvice } from '../controllers/weatherai.controller.js';


const router = express.Router();

router.post('/ai', getWeatherAdvice);

export default router;
