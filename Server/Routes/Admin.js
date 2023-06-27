import express  from "express";

const router = express.Router();

import { signin } from '../Controllers/Admin.js';
import { getUsers } from "../Controllers/User.js";


router.post('/adminlogin', signin);

router.get('/users', getUsers)


export default router;