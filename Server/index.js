import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './Routes/User.js';
import tourRouter from './Routes/tour.js';
import adminRouter from './Routes/Admin.js';
import chatRouter from './Routes/ChatRoute.js'
import MessageRouter from './Routes/MessageRouter.js'
import dotenv from 'dotenv';
import path from 'path'
import cookieParser from 'cookie-parser';
const port = 5000;
const app = express();
import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer(app);
import notFoundMiddleware from './Middleware/404.js'

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","https://touro.unitedwestand.online/"]
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});
app.use(morgan("dev"))

app.use(express.json({limit :'50mb', extended : true}))
app.use(express.urlencoded({limit :'10mb', extended : true}))
app.use(cookieParser())
app.use(express.static(path.resolve()+'/public'))

dotenv.config();

app.use('/uploads', express.static('public/uploads'));

app.use(cors({origin:["http://localhost:3000","https://touro.unitedwestand.online/"], credentials:true}))

app.use('/users', userRouter);
app.use('/tour', tourRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);
app.use('/message',MessageRouter )
app.use(notFoundMiddleware);


mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB,
  { useNewUrlParser: true, useUnifiedTopology: true, w: 'majority' }
  )
.then(()=>{
  console.log("db connected" );   
    
}).catch((error)=>{
    console.log(error, "cannot connect to the database");
})
server.listen(port, ()=>{
  console.log("port running on 5000 " );  
})

