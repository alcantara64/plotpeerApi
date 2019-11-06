import BaseController from './base.controller';
import User from '../models/user';

class KycController extends BaseController {
  whitelist = ['firstname', 'lastname', 'email', 'password', 'aml', 'kyc'];

  _populate = async (req, res, next) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        const err = new Error('User not found.');
        err.status = 404;
        return next(err);
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };

  getPenndingRequest = async (req, res, next) => {
    try {
      // @TODO Add pagination
      res.json(await User.find({ kyc_status: 'pending' }));
    } catch (err) {
      next(err);
    }
  };


  create = async (req, res, next) => {
    const { file } = req;
    const { mimetype, path } = file;
    if (file) {
      const user = req.user || req.currentUser;
      const id = user._id;
      const allowedExtentions = ['png', 'jpg', 'jpeg'];

      // if(!allowedExtentions.includes(mimetype)){
      //   return res.status(400).json({error:'unsupported type'});
      // }

      try {
        const savedUser = await User.findByIdAndUpdate(id, {
          kyc_status: 'pending',
          kycImage: path,
        });

        res.status(201).json({ savedUser });
      } catch (err) {
        err.status = 400;
        next(err);
      }
    }
  };

  update = async (req, res, next) => {
     const newAttributes = this.filterParams(req.body, this.whitelist);
     const updatedUser = Object.assign({}, req.currentUser, newAttributes);
    try {
      res.status(200).json(await updatedUser.save());
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    try {
      await req.currentUser.remove();
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };


}

export default new KycController();