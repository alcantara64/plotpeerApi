import BaseController from './base.controller';
import User from '../models/user';
import Wallet from '../models/wallet'


class WalletController extends BaseController {

  whitelist = [
    
    'reference',
    'amount',
    'paymentGateway'
    
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


  fetch = (req, res) => {
    const user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  }

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);
  const email = req.body.amount;
    let newWallet = new Wallet({
      ...params,
      
    });
   
    try {
      const savedUser = await Wallet.save();
      const reference_number = savedUser.reference;
      

      res.status(201).json({ message: 'succeessdul',reference:reference_number });
    } catch(err) {
      err.status = 400;
      next(err);
    }
  }

  withdraw = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);
  
  }


}

export default new WalletController();
