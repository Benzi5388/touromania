import jwt from 'jsonwebtoken';

const secret = 'test';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.user;
    console.log('Token:', token);
    if (token) {
      const decodedData = jwt.verify(token, secret, { ignoreExpiration: true });
      req.userId = decodedData?.id;
      console.log(req.userId, "auth middleware");
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default auth;
