import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/User.js';
import { sentOTP } from '../Helpers/SendOtp.js';

const secret = 'test';


//POST METHOD FOR SIGNIN
export const signin = async (req, res) => {
  console.log(req.body,111);
  const { email, password } = req.body.formValue;
  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "user doesnt exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret)
    
    const userData = {
      email: oldUser.email,
      id: oldUser._id,
      name: oldUser.name, // Include any other user details you want to send
    };
    
    console.log(token);
    res
    .status(200)
    .cookie('user', token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }).json({token:token, userData : userData});
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}


//POST METHOD FOR OTP
export const verify = async (req, res) => {
  console.log('Verify route accessed');
  console.log(req.cookies);

  console.log(req.body.formValue.otp, 111);
  const { otp } = req.body.formValue;

  let response = jwt.verify(req.cookies.user, secret)
  console.log(response, "xcvbnm");
  try {
    if (otp != response.otp) {
      return res.status(400).json({ message: "Rong otp, please try again" });
    }
    else {
      return res.status(201).json({ message: "Registergered successfully" })
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

//POST METHOD FOR SIGNUP
export const signup = async (req, res) => {
  console.log(req.body.formValue);
  const { email, password, firstName, lastName } = req.body.formValue;
  try {
    const oldUser = await UserModel.findOne({ email });
    console.log(oldUser, "oldone");
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 4);
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      });
      const OTP = Math.floor(Math.random() * 90000) + 10000;
      console.log(OTP, "register controller");
      await sentOTP(email, OTP);

      const result = await newUser.save();

      const token = jwt.sign(
        { email: result.email, id: result._id, otp: OTP },
        secret);
      console.log(token, "token from sign in ");
      res.status(201).cookie('user', token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }).json({ result, token , otp: OTP });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Specify the desired limit per page
    const skip = (parseInt(page) - 1) * limit;

    const searchQuery = req.query.search;
    const searchFilters = {};

    if (searchQuery) {
      searchFilters.$or = [
        { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on tour name
        { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }, // Case-insensitive search on tags
        { name: { $regex: searchQuery, $options: 'i' } }
      ];
    }
     
    const totalUsers = await UserModel.countDocuments(searchFilters);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await UserModel.find(searchFilters)
      .skip(skip)
      .limit(limit)
      .exec();
    res.status(200).json({
      users,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" });
  }
};


export const regenerateAndSendOTP = async (req, res) => {
  const { email } = req.body; // Retrieve email from request body
  try {
    const OTP = Math.floor(Math.random() * 90000) + 10000;
    console.log(OTP, "regenrate otp controller");
    const decodedToken = jwt.verify(req.cookies.user, secret);
    decodedToken.otp = OTP;
    const updatedToken = jwt.sign(decodedToken, secret);
    res.cookie('user', updatedToken, { httpOnly: true });
    console.log(OTP, "ytrewqwerty");
    await sentOTP(email, OTP); // Replace with your own logic to send the OTP via email
    res.status(200).json({ message: 'OTP resent successfully', otp: OTP  });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate and send OTP');
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "user doesnt exist" });
    
    const OTP = Math.floor(Math.random() * 90000) + 10000;
    const decodedToken = jwt.verify(req.cookies.user, secret);
    decodedToken.otp = OTP;
    const updatedToken = jwt.sign(decodedToken, secret);
    res.cookie('user', updatedToken, { httpOnly: true });
    console.log(OTP, "ytrewqwerty");
    await sentOTP(email, OTP); // Replace with your own logic to send the OTP via email
    res.status(200).json({ message: 'OTP resent successfully', otp: OTP  });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

export const resetPassword = async (req, res) => {
  console.log(req.body); // Check the entire request body
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword); // Check the password and confirmPassword values
  const { email } = req.cookies;

  try {
    const oldUser = await UserModel.findOne({ email });
    console.log(oldUser, "asdfghnmjhgfds");
    if (password !== confirmPassword) return res.status(404).json({ message: "Passwords don't match" });
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password with the new hashed password
    oldUser.password = hashedPassword;
    await oldUser.save();

    // Verify the OTP and retrieve the updated OTP from the cookie
    const decodedToken = jwt.verify(req.cookies.user, secret);
    if (!decodedToken || !decodedToken.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const updatedOTP = decodedToken.otp;

    // Update the token with the new OTP
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id, otp: updatedOTP },
      secret);

    console.log(token, "token");
    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    // Find the tour by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete the tour
    await UserModel.deleteOne({ _id: id });
    res.status(200).json({  message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};


export const googleSignIn = async (req, res) => {
  const { email, name, token, googleId } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name }
      return res.status(200).json({ result, token })
    }
    const result = await UserModel.create({
      email, name, googleId
    });

    res.status(200).json({ result, token })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

export const logOut = (req, res) => {
  try {
    // Clear the user token cookie
    res.cookie('user', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });
  
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

