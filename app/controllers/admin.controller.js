import BaseController from "./base.controller";
import User from "../models/user";

class AdminController extends BaseController {
  whitelist = [
    "firstname",
    "lastname",
    "email",
    "phone",
    "password",
    "aml",
    "kyc"
  ];
  //#region Users
  users = async (req, res, next) => {
    try {
      // @TODO Add pagination
      res.json(await User.find());
    } catch (err) {
      next(err);
    }
  };

  user = async (req,res,next) => {
      const {id} = req.params;
      try{
        res.json(await User.findById(id))
      }catch(err){
        next(err);
      }
  }

  updateKycRequest = (req, res,next) => {
      const {status,id} = req.body;
      try{
     User.findByIdAndUpdate(id,{
         kyc_status : status,
     },{},(err,doc)=>{
         if(err){
           return res.sendStatus(400);
         }
         return doc;
     })
      }catch(err){
        next(err);
      }
  }

  deleteUser = (req,res,next)=>{
      const {id} = req.params;
      try{
      if(id){
        User.findByIdAndDelete(id)  
      }
    }catch(err){
        return res.json(err);
    }
  }

  





  
}

export default new AdminController();
