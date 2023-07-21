import express  from "express";

const router = express.Router();

import { forgotPassword, googleSignIn, regenerateAndSendOTP, signin, signup, verify, resetPassword, logOut, verifyGAuth, checkUserLoggedIn, createOrder, paymentSuccess } from '../Controllers/User.js';
import { getSingleTour } from "../Controllers/Tour.js";
import auth from "../Middleware/auth.js";

router.post('/signup', signup);
router.post('/signin',signin);
router.get("/login/check", checkUserLoggedIn)

router.get('/google/callback', googleSignIn);
router.get('/google/verify', verifyGAuth)

router.post('/resendOTP', regenerateAndSendOTP);
router.post('/verifyOTP', forgotPassword);
router.post('/otp', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword)
router.get('/:id', getSingleTour)
router.post('/logout', logOut)
router.post('/payment/:id', createOrder)
router.post('/paymentSuccess/:id', paymentSuccess)


// router.get('/profile', getUsers)





export default router;