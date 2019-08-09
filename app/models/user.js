import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Post from './post';
import Constants from '../config/constants';


const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstname: String,
  lastname : String,
  email: { 
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  role: {
    type: String,
    enum: ['developer', 'customer','admin'],
    default: 'customer',
  },
  comfirmStatus:{
    type:Boolean,
    default:false
  },
  emailComfirmToken : String,
  address: String,
     city: String,
     phone: String,
     state: String,
     country: String,
     dob: String,
     kycImage:String,
     aml_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
            },
        kyc_status: {
          type: String,
          enum: ['awaiting','pending', 'approved','rejected'],
          default: 'awaiting',
            },
},

{
  timestamps: true,
});

// Strip out password field when sending user object to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
  },
});

//Ensure email has not been taken

//Validate  is not taken
UserSchema
  .path('email')
  .validate((email, respond) => {
    UserModel.findOne({ email })
      .then((user) => {
        respond(user ? false : true);
      })
      .catch(() => {
        respond(false);
      });
  }, 'Username already taken.');

//Validate password field
UserSchema
  .path('password')
  .validate(function(password) {
    return password.length >= 6 && password.match(/\d+/g);
  }, 'Password be at least 6 characters long and contain 1 number.');

//
UserSchema
  .pre('save', function(done) {
    // Encrypt password before saving the document
    if (this.isModified('password')) {
      const { saltRounds } = Constants.security;
      this._hashPassword(this.password, saltRounds, (err, hash) => {
        this.password = hash;
        done();
      });
    } else {
      done();
    }
    // eslint-enable no-invalid-this
  });

/**
 * User Methods
 */
UserSchema.methods = {
  getPosts() {
    return Post.find({ _user: this._id });
  },

  /**
   * Authenticate - check if the passwords are the same
   * @public
   * @param {String} password
   * @return {Boolean} passwords match
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  },

  /**
   * Generates a JSON Web token used for route authentication
   * @public
   * @return {String} signed JSON web token
   */
  generateToken() {
    return jwt.sign({ _id: this._id }, Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  },
  /**
   * Create password hash
   * @private
   * @param {String} password
   * @param {Number} saltRounds
   * @param {Function} callback
   * @return {Boolean} passwords match
   */
  _hashPassword(password, saltRounds = Constants.security.saltRounds, callback) {
    return bcrypt.hash(password, saltRounds, callback);
  },
  generateComfirmationUrlToken(){
    return jwt.sign(
      { 
        _id: this._id ,
        email:this.email,
        comfirmStatus:true
      }, 
      Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  },
  setComfirmationToken(){
    this.emailComfirmToken = this.generateComfirmationUrlToken;
  },
   getConfirmationUrl() {
    return `${process.env.HOST}/confirmation/${this.generateToken()}`;
  },
   getForgotPasswordToken() {
    return jwt.sign(
      {
        _id: this._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  },
  
};

const UserModel = mongoose.model('Users', UserSchema);

export default UserModel;
