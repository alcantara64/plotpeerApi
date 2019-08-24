import BaseController from './base.controller';

import Message from '../models/message';

class MessageController extends BaseController {

  whitelist = [
    'email',
  ];


  getMessages = async (req, res, next) => {

    try {
    const userId = req.currentUser._id;
        console.log('User', userId);
      const messages =
        await Message.find({ user: userId });

      res.json( messages);
    } catch(err) {
      next(err);
    }
  }


  getMessage = (req, res, next) => {
    const { id } = req.params;
    Message.findById(id, (err, doc)=>{
      if(err) {
        new Error('Project not fiund');
      }
     return res.json(doc);
    });
  }

  /**
   * req.user is populated by middleware in routes.js
   */

  create = async (req, res, next) => {
    const params = req.body;// this.filterParams(req.body, this.whitelist);

    const message = new Message({
      ...params,
      user: req.currentUser._id,
    });

    try {
      res.status(201).json(await message.save());
    } catch(err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    const params = req.body;// this.filterParams(req.body, this.whitelist);

    try {
        Message.findByIdAndUpdate(params.id, ...params);
      res.status(201);
    } catch(err) {
      next(err);
    }
  }

  delete = async (req, res, next) => {
    /**
     * Ensure the user attempting to delete the post owns the post
     *
     * ~~ toString() converts objectIds to normal strings
     */
    if (req.project._user.toString() === req.currentUser._id.toString()) {
      try {
        await req.post.remove();
        res.sendStatus(204);
      } catch(err) {
        next(err);
      }
    } else {
      res.sendStatus(403);
    }
  }
}

export default new MessageController();