import { Router } from 'express';
import { getCropCatalog } from '../controllers/cropRecommender.controller.js';

const router = Router();

router.get('/catalog', getCropCatalog);

export default router;
