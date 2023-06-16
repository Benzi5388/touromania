import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/User.js';
import { sentOTP } from '../Helpers/SendOtp.js';

const secret = 'test';


//POST METHOD FOR SIGNIN
export const signin = async (req, res) =>{
    const {email, password} = req.body;
    try {
        const oldUser = await UserModel.findOne({email});
        if(!oldUser) return res.status(404).json({message :"user doesnt exist"});

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
        if(!isPasswordCorrect)  return res.status(400).json({message :"Invalid Credentials"});

        const token = jwt.sign({email: oldUser.email, id : oldUser._id}, secret, {
            expiresIn : '1hr'
        })
        res.status(200).json({result :oldUser, token})

    } catch (err){
        res.status(500).json({ message: 'Something went wrong' });
    }
}

//POST METHOD FOR OTP
export const verify = async (req, res) =>{
  
  console.log(req.body);
  const {FormData,token} = req.body;
  console.log(FormData,"gg",token);
  let response=jwt.verify(token,secret)
  console.log(response)
  try {
    console.log("hhh");
    if(FormData.otp!=response.otp){

      console.log("222");
       return res.status(400).json({message :"Rong otp, please try again"});
    }
      else{
        console.log("333");
       return res.status(201).json({message :"Registergered successfully"})
      }
  } catch (err){
    console.log("555");
      res.status(500).json({ message: 'Something went wrong' });
  }
}

//POST METHOD FOR SIGNUP
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    console.log(email, "sdsdsds");
    // 
    try {
      const oldUser = await UserModel.findOne({ email });
      console.log(oldUser, "oldone");
      if (oldUser) {
        console.log("old user");
        return res.status(400).json({ message: "User already exists" });
      } else {
        console.log("else fun");
      const hashedPassword = await bcrypt.hash(password, 4);

      const newUser = new UserModel({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const result = await newUser.save();
    console.log(result);
      let OTP = Math.floor(Math.random() * 90000) + 10000;
      console.log(OTP);
      await sentOTP(email, OTP);
      const token = jwt.sign({ email: result.email, id: result._id,otp:OTP }, secret, {
        expiresIn: '1hr',
      });
      console.log(token);
      res.status(201).json({ result, token });
    }
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  export const forgotPassword = async (req, res) =>{
    const {email} = req.body;
    try {
        const oldUser = await UserModel.findOne({email});
        if(!oldUser) return res.status(404).json({message :"user doesnt exist"});
        let OTP = Math.floor(Math.random() * 90000) + 10000;
        await sentOTP(email, OTP);
    } catch (err){
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const resetPassword = async (req, res) =>{
  const {password, confirmPassword} = req.body;
  try {
      const oldUser = await UserModel.findOne({email});
      if(password!==confirmPassword) return res.status(404).json({message :"passwords dnt match"});
        
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
      if(!isPasswordCorrect)  return res.status(400).json({message :"Invalid Credentials"});

      const token = jwt.sign({email: oldUser.email, id : oldUser._id}, secret, {
          expiresIn : '1hr'
      })
      res.status(200).json({result :oldUser, token})

  } catch (err){
      res.status(500).json({ message: 'Something went wrong' });
  }
}

  export const googleSignIn = async (req, res) =>{
    const {email, name, token, googleId} = req.body;

    try {
      const oldUser = await UserModel.findOne({email});
      if(oldUser){
        const result = {_id: oldUser._id.toString(), email, name}
        return res.status(200).json({result, token})
      }
      const result = await UserModel.create({
        email, name, googleId
      });

      res.status(200).json({result, token})
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }}
  
