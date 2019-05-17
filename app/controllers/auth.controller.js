import BaseController from './base.controller';
import User from '../models/user';
import EmailSender  from '../lib/email';
import nodemailer from  'nodemailer';
import crypto from 'crypto';
import async from 'async';

class AuthController extends BaseController {
  whitelist = ['email','password','fullname']
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
 
      if (!user || !user.authenticate(password)) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      const token = user.generateToken();
      const userId = user._id;
      return res.status(200).json({ token,userId});
    } catch (err) {
      next(err);
    }
  }
  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);
   
  const {firstname, lastname,email} =  req.body 

    let newUser = new User(req.body);
   
    try {
     
      
      const savedUser = await newUser.save();
      const token = savedUser.generateToken();
      EmailSender.sendConfirmationMail(firstname,email,token);
      res.status(201).json({ token });
    } catch(err) {
      err.status = 400;
     console.error(err)
      next(err);
    }
  }


  forgotPassword = async (req, res, next) => {
    console.log(req.body.email)
    async.waterfall([
      function(done) {
        User.findOne({
          email: req.body.email
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
        User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
          done(err, token, new_user);
        });
      },
      function(token, user, done) {

        EmailSender.resetLink(user.email,user.firstname,token)
        res.status(200).json({ message: 'sent' })
      }
    ], function(err) {
      return res.status(422).json({ message: err });
    });
  }
  resetPassword = async (req, res, next) => {
    User.findOne({
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    }).exec(function(err, user) {
      if (!err && user) {
        if (req.body.newPassword === req.body.verifyPassword) {
          user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
          user.reset_password_token = undefined;
          user.reset_password_expires = undefined;
          user.save(function(err) {
            if (err) {
              return res.status(422).send({
                message: err
              });
            } else {
              var data = {
                to: user.email,
                from: email,
                template: 'reset-password-email',
                subject: 'Password Reset Confirmation',
                context: {
                  name: user.lastname,
                }
              };
  
              nodemailer.smtpTransport.sendMail(data, function(err) {
                if (!err) {
                  return res.json({ message: 'Password reset' });
                } else {
                  return done(err);
                }
              });
            }
          });
        } else {
          return res.status(422).send({
            message: 'Passwords do not match'
          });
        }
      } else {
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }
    });

}
}
export default new AuthController();