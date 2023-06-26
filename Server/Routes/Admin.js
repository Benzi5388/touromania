import express  from "express";

const router = express.Router();

import { signin } from '../Controllers/Admin.js';
import {listTour, unlistTour} from '../Controllers/Tour.js'
import { getUsers } from "../Controllers/User.js";


router.post('/adminlogin', signin);
router.patch('/tour/list/:id', listTour);
router.patch('/tour/unlist/:id', unlistTour);
router.get('/users', getUsers)


export default router;