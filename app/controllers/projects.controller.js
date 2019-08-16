import BaseController from './base.controller';

import Project from '../models/project';

class ProjectController extends BaseController {

  whitelist = [
    'email',
  ];

   // Middleware to populate post based on url param
  _populate = async (req, res, next) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) {
        const err = new Error('Project not found.');
        err.status = 404;
        return next(err);
      }

      req.project = project;
      next();
    } catch(err) {
      err.status = err.name ==='CastError' ? 404 : 500;
      next(err);
    }
  }

  search = async (req, res, next) => {
    try {
      const project =
        await Project.find({})
                  .populate({ path: '_user', select: '-projets -role' });

      res.json( project);
    } catch(err) {
      next(err);
    }
  }

  /**
   * req.project is populated by middleware in routes.js
   */

  fetch = (req, res) => {
    res.json(req.project);
  }

  /**
   * req.user is populated by middleware in routes.js
   */

  create = async (req, res, next) => {
    const params = req.body;// this.filterParams(req.body, this.whitelist);

    const project = new Project({
      ...params,
      investors: req.currentUser._id,
    });

    try {
      res.status(201).json(await project.save());
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

export default new ProjectController();
