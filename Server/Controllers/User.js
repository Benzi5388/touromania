import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/User.js';

const secret = 'test';


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

//POST METHOD FOR SIGNUP
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
      const oldUser = await UserModel.findOne({ email });
      if (oldUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 4);
  
      const result = await UserModel.create({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      });
  
      const token = jwt.sign({ email: result.email, id: result._id }, secret, {
        expiresIn: '1hr',
      });
      
      res.status(201).json({ result, token });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
