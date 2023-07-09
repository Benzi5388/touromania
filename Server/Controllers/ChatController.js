import ChatModel from "../Models/ChatModel.js";
import UserModel from '../Models/User.js';

export const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const result = await newChat.save()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const userChats = async(req, res)=>{
    try{
      const chat = await ChatModel.find({
        members : {$in : [req.params.userId]}
      })
      res.status(200).json(chat)
    } catch(err){
        res.status(500).json(err)
    }
}

export const findChat = async(req, res)=>{
    try{
     const chat = await ChatModel.findOne({
        members :{$all: [req.params.firstId,req.params.secondId]}})
        res.status(200).json(chat)
    }catch(err){
        res.status(500).json(err)
    }
}

export const getUser = async(req, res)=>{
    try {
        const user = await UserModel.findById(req.params.id);
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}