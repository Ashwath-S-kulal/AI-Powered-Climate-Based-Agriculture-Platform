import express from 'express';
import { google, facebookAuth, signout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/google', google);
router.post('/facebook', facebookAuth);
router.get('/signout', signout);

export default router;
