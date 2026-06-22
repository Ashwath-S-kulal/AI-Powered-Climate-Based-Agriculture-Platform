import express from 'express';
import { deleteUser, getAllUsers, updateUserRole } from '../controllers/admin.controller.js';
import {verifyAdmin, verifyToken} from '../utils/VerifyUser.js';


const router = express.Router();

router.get('/getallusers',verifyToken,verifyAdmin,getAllUsers); 
router.delete('/deleteuser/:id',verifyToken,verifyAdmin,deleteUser); 
router.put("/:id/role", verifyToken, verifyAdmin, updateUserRole);


export default router;
