/* eslint-disable no-console */
import BaseController from './base.controller';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import Wallet from '../models/wallet';
import EmailSender from '../lib/email';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Constants from '../config/constants';
import bcrypt from 'bcrypt';
import async from 'async';

class AuthController extends BaseController {
  whitelist = ['email', 'password', 'firstname', 'lastname', 'phone'];
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user || !user.authenticate(password)) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        err.message = 'invalid credentials';
        return next(err);
      }

      const token = user.generateToken();
      const userId = user._id;
      return res.status(200).json({ token, userId });
    } catch (err) {
      next(err);
    }
  }
  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

  const { firstname, email } = req.body;
    let newUser = new User(params);

    try {
      const savedUser = await newUser.save();
      const token = savedUser.generateToken();
      const comfirmationToken = savedUser.getConfirmationUrl();
      let wallet = new Wallet({
        user: savedUser._id,
        balance: 0,
      });
      await wallet.save();
      EmailSender.sendConfirmationMail(firstname, email, comfirmationToken);
      res.status(201).json({ token });
    } catch(err) {
      err.status = 400;
     console.error(err);
      next(err);
    }
  }


  forgotPassword = async (req, res, next) => {
    console.log(req.body.email);
    async.waterfall([
      function(done) {
        User.findOne({
          email: req.body.email,
        }).exec((err, user) => {
          console.log(user);
          if (user) {
            done(err, user);
          } else {
            done('User not found.');
          }
        });
      },
      function(user, done) {
        // create the random token
        crypto.randomBytes(20, function(err, buffer) {
          let token = buffer.toString('hex');
          done(err, user, token);
        });
      },
      function(user, token, done) {
        // eslint-disable-next-line max-len
        User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, newUser) {
          done(err, token, newUser);
        });
      },
      function(token, user, done) {
        EmailSender.resetLink(user.email, user.firstname, token);
        res.status(200).json({ message: 'sent' });
      },
    ], function(err) {
      return res.status(422).json({ message: err });
    });
  }
  resetPassword = async (req, res, next) => {
    User.findOne({
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now(),
      },
    }).exec(function(err, user) {
      if (!err && user) {
        if (req.body.newPassword === req.body.verifyPassword) {
          user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
          user.reset_password_token = undefined;
          user.reset_password_expires = undefined;
          user.save(function(err) {
            if (err) {
              return res.status(422).send({
                message: err,
              });
            } else {
              let data = {
                to: user.email,
                from: `noreply@plootpeer.com`,
                template: 'reset-password-email',
                subject: 'Password Reset Confirmation',
                context: {
                  name: user.lastname,
                },
              };

              nodemailer.smtpTransport.sendMail(data, function(err) {
                if (!err) {
                  return res.json({ message: 'Password reset' });
                } else {
                  return next(err);
                }
              });
            }
          });
        } else {
          return res.status(422).send({
            message: 'Passwords do not match',
          });
        }
      } else {
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.',
        });
      }
    });
}

verifyEmail = (req, res, next) =>{
  const { token } = req.params;
  const { sessionSecret } = Constants.security;
  jwt.verify(token, sessionSecret, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    // If token is decoded successfully, find user and comfirm

    try {
     User.findByIdAndUpdate(decoded.id, {
       comfirmStatus: true }, (err, res)=>{
         if(err) {
          return res.sendStatus(400);
         }
         if(res)return res.sendStatus(201);
       });
      next();
    } catch(err) {
      next(err);
    }
  }
 );
}
}
export default new AuthController();