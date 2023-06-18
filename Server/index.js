import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './Routes/User.js';
import tourRouter from './Routes/tour.js';
import dotenv from 'dotenv';
import path from 'path'
const port = 5000;
const app = express();

app.use(morgan("dev"))

app.use(express.json({limit :'50mb', extended : true}))
app.use(express.urlencoded({limit :'10mb', extended : true}))
app.use(express.static(path.resolve()+'/public'))
app.use(
    cors({
      origin: [
        "http://localhost:3000"
      ],
      credentials: true,
    })
  );

  dotenv.config()

// Set COOP headers in your Express app
// app.use((req, res, next) => {
//     res.set("Cross-Origin-Opener-Policy", 'same-origin');
//     next();
//   });
  
app.use('/users', userRouter);
app.use('/tour', tourRouter);


mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB,
  { useNewUrlParser: true, useUnifiedTopology: true, w: 'majority' }
  )
.then(()=>{
  console.log("db connected" );   
    
}).catch((error)=>{
    console.log(error, "cannot connect to the database");
})
app.listen(port, ()=>{
  console.log("port running on 5000 " );  
  
})
// mongodb+srv://benzi5388:fCc4PtAVLFuW8FHe@cluster0.phfdrr6.mongodb.net/?retryWrites=true&w=majority