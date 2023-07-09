import express  from "express";
import { createChat, findChat, getUser, userChats } from "../Controllers/ChatController.js";
const router = express.Router();

router.post('/', createChat)
router.get('/:userId', userChats)
router.get('/find/:firstId/:secondId', findChat)
router.get('/user/:id', getUser )

export default router;