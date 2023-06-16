import express  from "express";

const router = express.Router();

import { forgotPassword, googleSignIn, resetPassword, signin, signup, verify } from '../Controllers/User.js';

router.post('/signup', signup);
router.post('/signin',signin);
router.post('/gooleSignIn', googleSignIn);
router.post('/otp', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword)

export default router;