import jwt from 'jsonwebtoken';
import User from '../models/user';
import Constants from '../config/constants';

const { sessionSecret } = Constants.security;
export default function authenticate(req, res, next) {
  const { authorization } = req.headers;
  if(!authorization){
    return res.sendStatus(401);
  }
  let Bearer = authorization.split(' ');
  const token =Bearer[1];
  jwt.verify(token, sessionSecret, async (err, decoded) => {
    if (err) {
      console.error(err)
      return res.sendStatus(401);
    }

    // If token is decoded successfully, find user and attach to our request
    // for use in our route or other middleware
    try {
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.sendStatus(401);
      }
      req.currentUser = user;
      next();
    } catch(err) {
      next(err);

    }
  });
}
