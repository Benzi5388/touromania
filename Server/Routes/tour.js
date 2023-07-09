import express  from "express";
const router = express.Router();
import  auth from '../Middleware/auth.js'

import { createTour, deleteTour, getSingleTour, getTour, getToursByUser, likeTour, updateTour} from '../Controllers/Tour.js';
import { upload } from "../Helpers/multer.js";


//PROTECTED ROUTES
router.get('/',getTour);
router.post('/addtour',auth, upload.single('file'), createTour);
router.post('/editTour/:id',auth, upload.single('file'),updateTour)
router.get('/:id',auth, deleteTour);
router.get('/userDashboard/:id',auth, getToursByUser)
router.get('/editTour/:id',auth, getSingleTour)
router.patch('/like/:id', auth, likeTour)


export default router;