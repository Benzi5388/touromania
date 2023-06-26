import express  from "express";

const router = express.Router();

import { forgotPassword, getUsers, googleSignIn, regenerateAndSendOTP, signin, signup, verify, resetPassword } from '../Controllers/User.js';

router.post('/signup', signup);
router.get('/profile', getUsers)
router.post('/signin',signin);
router.post('/gooleSignIn', googleSignIn);
router.post('/resendOTP', regenerateAndSendOTP);
router.post('/verifyOTP', forgotPassword);
router.post('/otp', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword)

export default router;