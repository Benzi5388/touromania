import jwt from 'jsonwebtoken';
import TourModel from '../Models/Tour.js';
import UserModel from '../Models/User.js';
const secret = 'test';


export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (email === 'admin@gmail.com' && password === '1234') {
        // Create a token for the admin
        const adminToken = jwt.sign({ email, isAdmin: true }, secret);
        console.log(adminToken, 'token from sign in ');
        res.cookie('admin', adminToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        });
        res.status(201).json({ admin: adminToken });
      }
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  export const logout = (req, res) => {
    try {
      // Clear the admin token cookie
      res.cookie('admin', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        expires: new Date(0),
      });
    
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  // Fetch the count of tours
  export const getTourCount = async (req, res) => {
    try {
      const tourCounts = await TourModel.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            publicCount: {
              $sum: {
                $cond: [{ $eq: ['$privacy', 'public'] }, 1, 0]
              }
            },
            privateCount: {
              $sum: {
                $cond: [{ $eq: ['$privacy', 'private'] }, 1, 0]
              }
            }
          }
        }
      ]);
  
      if (tourCounts.length === 0) {
        res.status(404).json({ message: 'Tour count not found' });
        return;
      }
  
      const { totalCount, publicCount, privateCount } = tourCounts[0];
      console.log( totalCount, publicCount, privateCount, "counts");
      res.status(200).json({ totalCount, publicCount, privateCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tour count' });
    }
  };
  

// Fetch the count of users
export const getUserCount = async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments();
    const premiumUserCount = await UserModel.countDocuments({ isPremium: true });
    const nonPremiumUserCount = userCount - premiumUserCount;

    console.log(userCount, premiumUserCount, nonPremiumUserCount, "usercount");

    res.status(200).json({ totalCount: userCount, premiumCount: premiumUserCount, nonPremiumCount: nonPremiumUserCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user count' });
  }
};
export const checkAdminLoggedIn = async (req, res) => {
  try {
      const token = req.cookies.admin;
      console.log("token,",token)
      if (!token)
          return res.json({ loggedIn: false, error: true, message: "no token" });
      const verifiedJWT = jwt.verify(token, secret);
      return res.json({ adminData:{email:"admin@gmail.com"}, loggedIn: true, token });
  } catch (err) {
      console.log(err)
      res.json({ loggedIn: false, error: err });
  }
}