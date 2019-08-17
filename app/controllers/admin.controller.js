/* eslint-disable no-console */

import btoa from 'btoa';
import axios from 'axios';
import BaseController from './base.controller';
import User from '../models/user';
import Project from '../models/project';
import fs from 'fs';
import appRoot from 'app-root-path';

class AdminController extends BaseController {
  whitelist = [
    'firstname',
    'lastname',
    'email',
    'phone',
    'password',
    'aml',
    'kyc',
  ];
  // #region Users
  users = async (req, res, next) => {
    try {
      // @TODO Add pagination
      res.json(await User.find());
    } catch (err) {
      next(err);
    }
  };

  user = async (req, res, next) => {
      const { id } = req.params;
      try{
        res.json(await User.findById(id));
      }catch(err) {
        next(err);
      }
  }

  updateKycRequest = (req, res, next) => {
      const { status, id } = req.body;
      try{
     User.findByIdAndUpdate(id, {
         kyc_status: status,
     }, {}, (err, doc)=>{
         if(err) {
           return res.sendStatus(400);
         }
         return doc;
     });
      }catch(err) {
        next(err);
      }
  }

  shuftiproRequest = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(user.id) {
    let payload = {
      reference: `${user.id}`,
      callback_url: `${process.env.SERVER_URL/'admin/shufti/notify'}`,
      email: `${user.email}`,
      country: '',
      language: 'EN',
      verification_mode: 'any',
  };

    // get document sample proof base64
    this.convertImgToBase64URL(`${appRoot}/${user.kycImage}`)
    .then((response) => {
      // Use this key if you want to perform document verification
      payload['document'] = {
        proof: response,
        additional_proof: response,
        name: '',
        dob: '',
        document_number: '',
        expiry_date: '',
        issue_date: '',
        supported_types: ['id_card', 'passport'],
      };
      let token = btoa(`${process.env.SHUFTIPRO_CLIENT_ID}:${process.env.SHUFTIPRO_SECRET}`); // BASIC AUTH TOKEN
      // Dispatch request via fetch API or with whatever else which best suits for you
      axios({ url: 'https://shuftipro.com/api/',
        method: 'POST',
        data: JSON.stringify(payload),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      },
    }).then(function(response) {
        // console.log('response',response)
          return response.json();
        })
        .then((data) => {
           console.log('Data returned', data);
          return res.json('success');
        })
        .catch((err)=>{
           new Error(err);
          console.log('Error from the shufti pro', err);

          next(err);
        });
    });
  }
  };

   /* METHOD USED TO Get image BASE 64 string*/
    convertImgToBase64URL =(file) => {
      console.log(file, 'Url of the image');
    return new Promise((resolve, reject) => {
    let bitmap = fs.readFileSync(file);
    // eslint-disable-next-line new-cap
    resolve(new Buffer.from(bitmap).toString('base64'));
    reject();
    });
  }

  shuftiproVerifcation = async (req, res, next) => {
    console.log('response from shufti pro', res);
  }

  deleteUser = (req, res, next)=>{
      const { id } = req.params;
      try{
      if(id) {
        User.findByIdAndDelete(id);
      }
    }catch(err) {
        return res.json(err);
    }
  }


 getPendingKycRequest(req, res, next) {
   try{
   User.find({ kyc_status: 'pending' }, (error, doc)=>{
     if(error) {
       next(error);
     }else{
       return res.json(doc);
     }
   });
  }catch(err) {
    next(err);
  }
 }

 // #region project
 createProject = async (req, res, next) => {
  const params = req.body;// this.filterParams(req.body, this.whitelist);
console.log("params", params)
  const project = new Project({
    ...params,
  });

  try {
    res.status(201).json(await project.save());
  } catch(err) {
    new Error(err);
    next(err);
  }
}

getprojects = async (req, res, next) => {
  try {
    // @TODO Add pagination
    res.json(await Project.find());
  } catch(err) {
    next(err);
  }
}


updateProject = async (req, res, next) =>{
  const params = req.body;
 const { id } = req.params;
try{
await Project.findByIdAndUpdate(id, params, (err, doc)=>{
  if(err) {
    next(err);
  }else{
   return res.send(doc);
  }
});
}catch(err) {
 new Error(err);
 next(err);
}
}

deleteProject = async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    return res.sendStatus(403);
  }
  try {
    await Project.findByIdAndRemove(id)
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}
// #endregion

}

export default new AdminController();