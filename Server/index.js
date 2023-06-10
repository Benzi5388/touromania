import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './Routes/User.js'

const port = 5000;
const app = express();

app.use(morgan("dev"))
app.use(express.json({limit :"300", extended : true}))
app.use(express.urlencoded({limit :"300", extended : true}))
app.use(cors());
app.use('/users', userRouter);

const MONGODB_URL = "mongodb+srv://benzi5388:fCc4PtAVLFuW8FHe@cluster0.phfdrr6.mongodb.net/tour_db?retryWrites=true&w=majority"

mongoose.connect(MONGODB_URL)
.then(()=>{
    app.listen(port, ()=>{
        console.log("port running on 5000");  
    })
}).catch((error)=>{
    console.log(error, "cannot connect to the database");
})

// mongodb+srv://benzi5388:fCc4PtAVLFuW8FHe@cluster0.phfdrr6.mongodb.net/?retryWrites=true&w=majority