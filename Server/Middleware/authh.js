import jwt from 'jsonwebtoken';

const secret = 'test';

const authh = async (req, res, next) => {
  try {
    const token = req.cookies.admin;
    console.log('Token:', token);
    if (token) {
      const decodedData = jwt.verify(token, secret, { ignoreExpiration: true });
      req.adminId = decodedData?.email;
      console.log(req.adminId, "auth middleware");
    }

    if (!req.adminId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default authh;
