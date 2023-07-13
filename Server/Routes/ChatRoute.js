import express  from "express";
import { createChat, findChat, getUser, userChats } from "../Controllers/ChatController.js";
const router = express.Router();
import  auth from '../Middleware/auth.js'
import { getUsers } from "../Controllers/User.js";

router.post('/', createChat)
router.get('/:userId', userChats)
router.get('/find/:firstId/:secondId', findChat)
router.get('/user/:id', getUser )
router.get('/', getUsers)

export default router;