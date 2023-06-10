import express  from "express";

const router = express.Router();

import { signin, signup } from '../Controllers/User.js'

router.post('/signup', signup);
router.post('/signin',signin);

export default router;