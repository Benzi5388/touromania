import express  from "express";

const router = express.Router();
import  authh from '../Middleware/authh.js'

import { logout, signin } from '../Controllers/Admin.js';
import { deleteUser, getUsers } from "../Controllers/User.js";
import { getSingleTour, getTour } from "../Controllers/Tour.js";


router.post('/adminlogin', signin);

//PROTECTED ROUTES
router.get('/',authh, getTour);
router.get('/users',authh,  getUsers)
router.get('/user/:id', authh, deleteUser);
router.get('/tours/:id',authh, getSingleTour)
router.get('/logout', authh, logout)


export default router;