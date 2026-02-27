import express from 'express';
import { createShortUrl, deleteUrl,redirect,getAllUrls } from '../controllers/url.controller'
import {authRequest} from '../middlewares/url.middleware'
const router = express.Router();

router.post('/', authRequest,createShortUrl);
router.get('/', authRequest,getAllUrls);
router.delete('/:id',authRequest,deleteUrl);
router.get('/:shortCode', redirect);

export default router;

