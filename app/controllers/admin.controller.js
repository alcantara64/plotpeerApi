
import btoa from 'btoa';
import axios from 'axios';
import BaseController from "./base.controller";
import User from "../models/user";
import  fs from 'fs';

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

  shuptiproverifcation = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id)
    if(user.id){
    let payload = {
      reference         : `SP_REQUEST_${user.id}`,
      callback_url      : `${process.env.callback_url}`,
      email             : `${user.email}`,
      country           : "GB",
      language          : "EN",
      verification_mode : "any",
  }

    //get document sample proof base64
    this.convertImgToBase64URL(`./public/image.png`)
    .then(response => {
      //Use this key if you want to perform document verification
      payload["document"] = {
        proof: response,
        additional_proof: response,
        name: "",
        dob: "",
        document_number: "",
        expiry_date: "",
        issue_date: "",
        supported_types: ["id_card", "passport"]
      };

      //Use your Shufti Pro account client id and secret key
      let token = btoa(`${process.env.SHUFTIPRO_CLIENT_ID}:${process.env.SHUFTIPRO_SECRET}`); //BASIC AUTH TOKEN

      //Dispatch request via fetch API or with whatever else which best suits for you
      axios("https://shuftipro.com/api/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " + token
        },
        body: JSON.stringify(payload)
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
          return data;
        })
        .catch((err)=>{
         
          new Error(err);
          console.log(err);
          err.status = 401;
          next(err);

        });
    });   
    console.log(user,"the request got here")
  }
  };

   /*METHOD USED TO Get image BASE 64 string*/
    convertImgToBase64URL =(file) => {
      console.log(file,"Url of the image");
    return new Promise((resolve, reject) => {
      // var img = new Image();
      // img.crossOrigin = "Anonymous";
      // img.onload = function() {
      //   var canvas = document.createElement("CANVAS"),
      //     ctx = canvas.getContext("2d"),
      //     dataURL;
      //   canvas.height = img.height;
      //   canvas.width = img.width;
      //   ctx.drawImage(img, 0, 0);
      //   dataURL = canvas.toDataURL("image/jpeg");
      //   resolve(dataURL);
      //   canvas = null;
      // };
      // img.src = url;
      // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    resolve(new Buffer.from(bitmap).toString('base64'));
    reject(err);
    });
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
