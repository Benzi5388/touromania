import express  from "express";

const router = express.Router();

import { signin } from '../Controllers/Admin.js';
import { deleteUser, getUsers } from "../Controllers/User.js";


router.post('/adminlogin', signin);
router.get('/users', getUsers)
router.get('/:id', deleteUser);


export default router;