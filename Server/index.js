import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './Routes/User.js';
import tourRouter from './Routes/tour.js';
import adminRouter from './Routes/Admin.js';
import dotenv from 'dotenv';
import path from 'path'
import cookieParser from 'cookie-parser';
const port = 5000;
const app = express();

app.use(morgan("dev"))

app.use(express.json({limit :'50mb', extended : true}))
app.use(express.urlencoded({limit :'10mb', extended : true}))
app.use(cookieParser())
app.use(express.static(path.resolve()+'/public'))


const allowedOrigins = ['http://localhost:3000', 'https://accounts.google.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));



// Set COOP headers in your Express app

// app.use((req, res, next) => {
//     res.set("Cross-Origin-Opener-Policy", 'same-origin');
//     next();
//   });

  dotenv.config()

  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  
app.use('/users', userRouter);
app.use('/tour', tourRouter);
app.use('/admin', adminRouter);



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