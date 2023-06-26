import express  from "express";
const router = express.Router();
import  auth from '../Middleware/auth.js'

import { createTour, getSingleTour, getTour } from '../Controllers/Tour.js';
import { upload } from "../Helpers/multer.js";



router.post('/', auth, upload.single('file'), createTour);
router.get('/',getTour);
router.get('/:id', getSingleTour);


export default router;