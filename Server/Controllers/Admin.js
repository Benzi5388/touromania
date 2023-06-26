import jwt from 'jsonwebtoken';
const secret = 'test';

export const signin = async (req, res) =>{
    const {email, password} = req.body;
    try {
        if (email === 'admin@gmail.com' && password === '1234') {
            // Create a token for the admin
            const admintoken = jwt.sign({ email, isAdmin: true }, secret, {
              expiresIn: '30',
            });
            console.log(admintoken, "token from sign in ");
           res.status(201).cookie('admintoken', admintoken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }).json({ admintoken });
          }

    } catch (err){
        res.status(500).json({ message: 'Something went wrong' });
    }
}