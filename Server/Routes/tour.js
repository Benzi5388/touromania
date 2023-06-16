import express  from "express";

const router = express.Router();

import { createTour, getTour } from '../Controllers/Tour.js';

router.post('/', createTour);
router.post('/',getTour);


export default router;