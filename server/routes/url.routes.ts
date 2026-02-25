import express from 'express';
import { createShortUrl } from '../controllers/url.controller'
import { redirect } from '../controllers/url.controller'
import { getAllUrls } from '../controllers/url.controller'
import {authRequest} from '../middlewares/url.middleware'
const router = express.Router();

router.post('/', authRequest,createShortUrl);
router.get('/', authRequest,getAllUrls);
router.get('/:shortCode', redirect);


export default router;

