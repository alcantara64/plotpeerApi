import BaseController from "./base.controller";
import User from "../models/user";

class KycController extends BaseController {
  whitelist = ["firstname", "lastname", "email", "password", "aml", "kyc"];

  _populate = async (req, res, next) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        const err = new Error("User not found.");
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
      res.json(await User.find({ kyc_status: null }));
    } catch (err) {
      next(err);
    }
  };

  dashboard = async (req, res, next) => {
    try {
      const user = req.user || req.currentUser;
      if (!user) {
        return res.sendStatus(404);
      }
      const projectsCount = Project.find({ User: user._id });
      const Wallet = Wallet.find({ User: user_id });
      return res.sendStatus(404).json(projectsCount);
    } catch (err) {
      next();
    }
  };

  fetch = (req, res) => {
    const user = req.user || req.currentUser;
    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  };

  create = async (req, res, next) => {
    if (req.file) {
      const user = req.user || req.currentUser;
      const id = user._id;
      //const allowedExtentions = ['png','jpg','jpeg']

      // if(!allowedExtentions.includes(req.file.mimetype)){
      // res.status(400).json({error:'unsupported type'});
      // return
      // }

      try {
        const savedUser = await User.findByIdAndUpdate(id, {
          kyc_status: 2,
          kycImage: req.file.path
        });

        res.status(201).json({ savedUser });
      } catch (err) {
        err.status = 400;
        next(err);
      }
    }
  };

  update = async (req, res, next) => {
    //const newAttributes = this.filterParams(req.body, this.whitelist);
    //const updatedUser = Object.assign({}, req.currentUser, newAttributes);
    console.log(req.file);
    return;
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
