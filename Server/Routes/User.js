import express  from "express";

const router = express.Router();

import { forgotPassword, getUsers, googleSignIn, regenerateAndSendOTP, signin, signup, verify, resetPassword } from '../Controllers/User.js';
import { getSingleTour, updateTour } from "../Controllers/Tour.js";

router.post('/signup', signup);
router.post('/signin',signin);
router.post('/gooleSignIn', googleSignIn);
router.post('/resendOTP', regenerateAndSendOTP);
router.post('/verifyOTP', forgotPassword);
router.post('/otp', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword)
router.get('/:id', getSingleTour)

// router.get('/profile', getUsers)





export default router;