import express  from "express";

const router = express.Router();

import { forgotPassword, googleSignIn, regenerateAndSendOTP, signin, signup, verify, resetPassword, logOut, verifyGAuth } from '../Controllers/User.js';
import { getSingleTour } from "../Controllers/Tour.js";

router.post('/signup', signup);
router.post('/signin',signin);

router.get('/google/callback', googleSignIn);
router.get('/google/verify', verifyGAuth)

router.post('/resendOTP', regenerateAndSendOTP);
router.post('/verifyOTP', forgotPassword);
router.post('/otp', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword)
router.get('/:id', getSingleTour)
router.post('/logout', logOut)


// router.get('/profile', getUsers)





export default router;