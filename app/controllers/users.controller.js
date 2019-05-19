import BaseController from './base.controller';
import User from '../models/user';
import Project from '../models/project';
import Wallet from '../models/wallet';


class UsersController extends BaseController {

  whitelist = [
    'firstname',
    'lastname',
    'email',
    'password',
    'aml',
    'kyc'
  ];

  

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
    } catch(err) {
      next(err);
    }
  }

  search = async (req, res, next) => {
    try {
      // @TODO Add pagination
      res.json(await User.find());
    } catch(err) {
      next(err);
    }
  }

  dashboard = async (req,res,next) => {
    try {
      const user = req.user || req.currentUser;
      if(!user){
        return res.sendStatus(404);
      }
     const projectsCount  = Project.find({User:user._id});
     const Wallet = Wallet.find({User:user_id});
     return res.sendStatus(404).json(projectsCount);
      
  }catch(err){
    next()
  }

  
  }


  fetch = (req, res) => {
    const user = req.user || req.currentUser;
    if (!user) {
      return res.sendStatus(404);
    }
    
    res.json(user);
  }

create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);
  const email = req.body.email;
  
    let newUser = new User({
      ...params,
      provider: 'local',
    });
   
    try {
      const savedUser = await newUser.save();
      const token = savedUser.generateToken();
     

      res.status(201).json({ token });
    } catch(err) {
      err.status = 400;
      next(err);
    }
  }
  
  update = async (req, res, next) => {
    const newAttributes = this.filterParams(req.body, this.whitelist);
    const updatedUser = Object.assign({}, req.currentUser, newAttributes);
   console.log(req.file);
   return;
    try {
      res.status(200).json(await updatedUser.save());
    } catch (err) {
      next(err);
    }
  }

  

  delete = async (req, res, next) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    try {
      await req.currentUser.remove();
      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  }
}

export default new UsersController();
