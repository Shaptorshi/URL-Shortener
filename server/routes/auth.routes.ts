import express from 'express';
import {Register,Login} from '../controllers/auth.controller'

const router = express.Router();

router.post('/registerUser',Register);
router.post('/loginUser',Login);

export default router;