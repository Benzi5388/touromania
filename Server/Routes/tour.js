import express  from "express";

const router = express.Router();

import { createTour, getTour } from '../Controllers/Tour.js';
import { upload } from "../Helpers/multer.js";



router.post('/', upload.single('file'),createTour);
router.post('/',getTour);


export default router;