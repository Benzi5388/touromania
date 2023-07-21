import express  from "express";

const router = express.Router();
import  authh from '../Middleware/authh.js'

import { checkAdminLoggedIn, getTourCount, getUserCount, logout, signin } from '../Controllers/Admin.js';
import { deleteUser, getUsers } from "../Controllers/User.js";
import { getSingleTour, getTour } from "../Controllers/Tour.js";


router.post('/adminLogin', signin);

//PROTECTED ROUTES
router.get('/tours',authh, getTour);
router.get('/users',authh,  getUsers)
router.get('/user/:id', authh, deleteUser);
router.get('/tours/:id',authh, getSingleTour)

router.get('/tour-count', authh, getTourCount);
router.get('/user-count',authh,  getUserCount);
router.get("/login/check", checkAdminLoggedIn)

router.get('/logout', logout)
export default router;