import { Router } from 'express';


import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';
import ProjectController from './controllers/projects.controller';
<<<<<<< HEAD
import WalletController from './controllers/wallet.controller';
import Admincontroller from './controllers/admin.controller';

=======
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename:  (req, file, cb) => {
      cb(null,    Date.now() + '-'+ file.originalname )
    }
  })
>>>>>>> 4142cd3ca6919961809d832d014c2fb2882c03b9
import multer from 'multer';
const upload = multer({storage:storage});
import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';
import walletController from './controllers/wallet.controller';
import Transaction from './controllers/transaction.controller'
import kycController from './controllers/kyc.controller';

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public')
  },
  filename:  (req, file, cb) => {
    cb(null,    Date.now() + '-'+ file.originalname )
  }
})

const routes = new Router();

routes.get('/', authenticate, MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);
routes.post('/auth/forgotpassword', AuthController.forgotPassword);
routes.get('/auth/resetpassword/:token', AuthController.resetPassword);
routes.post('/auth/register',AuthController.create);


// Users
//routes.get('/user/dashboard',authenticate, UsersController.dashboard);
routes.get('/users', UsersController.search);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:username', UsersController._populate, UsersController.fetch);
routes.post('/users', UsersController.create);


//Wallet Routes
routes.get('/wallet', authenticate, walletController.getWallet);
routes.post('/wallet/fund', authenticate, walletController.fundWallet);
routes.post('/wallet/withdraw', authenticate, walletController.withdraw);

//Wallet transactions
routes.get('/transactions', authenticate, Transaction.all);
routes.get('/transactions/user', authenticate, Transaction.self);
routes.get('/transactions/:id', authenticate, Transaction.one);

// projects
routes.get('/projects', ProjectController.search);
routes.post('/projects', authenticate, ProjectController.create);
routes.get('/projects/:id', ProjectController._populate, ProjectController.fetch);
routes.delete('/projects/:id', authenticate, ProjectController.delete);

//kyc
routes.post('/users/kyc', [authenticate, upload.single('file')], kycController.create);

// Post
routes.get('/posts', PostsController.search);
routes.post('/posts', authenticate, PostsController.create);
routes.get('/posts/:id', PostsController._populate, PostsController.fetch);
routes.delete('/posts/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);
routes.get('/admin/users', accessControl('customer'), Admincontroller.users);
routes.get('/admin/user/:id',accessControl('customer'), Admincontroller.user);
routes.put('/admin/kyc',authenticate, Admincontroller.updateKycRequest);
routes.get('/admin/kyc/:id', Admincontroller.shuptiproverifcation);
routes.get('/admin/kyc', authenticate,Admincontroller.getPendingKycRequest);

routes.use(errorHandler);

export default routes;
