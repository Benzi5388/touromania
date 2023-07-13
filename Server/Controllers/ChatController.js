import ChatModel from "../Models/ChatModel.js";
import UserModel from '../Models/User.js';

export const createChat = async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
  
    try {
      // Check if the chat already exists between the sender and receiver
      const existingChat = await ChatModel.findOne({
        members: { $all: [senderId, receiverId] }
      });
  
      if (existingChat) {
        return res.status(400).json({ message: 'Chat already exists between the users' });
      }
  
      // Create a new chat
      const newChat = new ChatModel({
        members: [senderId, receiverId]
      });
  
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

export const userChats = async(req, res)=>{
    try{
      const chat = await ChatModel.find({
        members : {$in : [req.params.userId]}
      })
      console.log(chat, "chat from");
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
        console.log(req.params.id);
        const user = await UserModel.findById(req.params.id);
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}