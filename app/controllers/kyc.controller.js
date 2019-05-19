import BaseController from './base.controller';
import User from '../models/user';


class KycController extends BaseController {

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
   
  const id = req.user._id
  console.log('we are logged in')
    
   
    try {
      const savedUser = await User.findOneAndUpdate({_id:id, kyc_status:2});
      
     

      res.status(201).json({ savedUser });
    } catch(err) {
      err.status = 400;
      next(err);
    }
  }
  
  update = async (req, res, next) => {
    //const newAttributes = this.filterParams(req.body, this.whitelist);
    //const updatedUser = Object.assign({}, req.currentUser, newAttributes);
    console.log(req.file)
   return
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

export default new KycController();
