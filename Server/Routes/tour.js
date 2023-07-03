import express  from "express";
const router = express.Router();
import  auth from '../Middleware/auth.js'

import { createTour, deleteTour, getTour, getToursByUser, updateTour} from '../Controllers/Tour.js';
import { upload } from "../Helpers/multer.js";



router.post('/', upload.single('file'), createTour);
router.post('/editTour/:id', upload.single('file'),updateTour)
router.get('/',getTour);
router.get('/:id', deleteTour);
router.get('/userDashboard/:id', getToursByUser)



export default router;