import { Router } from 'express';


import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';
import ProjectController from './controllers/projects.controller';
import WalletController from './controllers/wallet.controller';
import multer from 'multer';
const upload = multer({dest:'uploads/'});
import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';
import walletController from './controllers/wallet.controller';
import kycController from './controllers/kyc.controller';

const routes = new Router();

routes.get('/', authenticate, MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);
routes.post('/auth/forgotpassword', AuthController.forgotPassword);
routes.get('/auth/resetpassword/:token', AuthController.resetPassword);
routes.post('/auth/register',AuthController.create);


// Users
routes.get('/user/dashboard',authenticate, UsersController.dashboard);
routes.get('/users', UsersController.search);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:username', UsersController._populate, UsersController.fetch);
routes.post('/users', UsersController.create);


//payment related
routes.get('/users/payment', authenticate, walletController.fetch);
routes.post('/users/payment', authenticate, walletController.create);
routes.post('/users/withdraw', authenticate, walletController.withdraw);


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
routes.get('/admin/users', accessControl('admin'), ProjectController.search);

routes.use(errorHandler);

export default routes;
