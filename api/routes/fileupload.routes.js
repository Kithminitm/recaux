const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const passport = require("passport");
const User = require('../db/users')
const Candidate = require('../db/candidates')

cloudinary.config({
  cloud_name: "dijjqfsto",
  api_key: "943785761215535",
  api_secret: "MSfacY2b-OGHnjJLiLni9zfH1R0"
});

const storageAvatar = multer.diskStorage({
  destination: "../assets/avatar",
  filename: function(req, file, cb) {
    console.log(req.params.id);

    cb(null, req.params.id + path.extname(file.originalname));
  }
});

const storageCv = multer.diskStorage({
  destination: "../assets/cv",
  filename: function(req, file, cb) {
    console.log(req.params.id);

    cb(null, req.params.id + path.extname(file.originalname));
  }
});

const avatarUpload = multer({ storage: storageAvatar,limits:{fileSize:2000000},

  fileFilter:function(req,file,cb){

    var fileTypesAllowed = /jpeg|png|jpg|gif/
    var extAvatar = fileTypesAllowed.test(path.extname(file.originalname).toLowerCase());
    var mimeType = fileTypesAllowed.test(file.mimetype)
    
    if(mimeType && extAvatar){
      return cb(null,true);
    } else {
      cb({'msg':'unsupported_format'});
    }
  
  }


}).single("avatar");

const cvUpload = multer({ storage: storageCv ,limits:{fileSize:10000000},
  fileFilter:function(req,file,cb){

    var fileTypesAllowed = /pdf/
    var extAvatar = fileTypesAllowed.test(path.extname(file.originalname).toLowerCase());
    var mimeType = fileTypesAllowed.test(file.mimetype)
    
    if(mimeType && extAvatar){
      return cb(null,true);
    } else {
      cb({'msg':'unsupported_format'});
    }
  
  }}
  
  ).single("cv");

exports.profileimgup = (req, ress, next) => {
  var res = "";
  passport.authenticate(
    "jwtstrategy",
    { session: false },
    (err, user, info) => {
      console.log(JSON.stringify(req.headers.authorization));
     

      console.log("baba yaga");

      if (!user) {
        console.log('error - '+info)
        ress.status(401).json(info);
      } else {
        avatarUpload(req, res, err => {
          if (err) {
            console.log('multer errorr-  '+JSON.stringify(err));

            if(err.code =="LIMIT_FILE_SIZE"){
              ress.status(400).send("file_too_large")
            }
            if(err.msg =="unsupported_format"){
              ress.status(400).send("unsupported_file_format")
            }
            
          } else {
            console.log(path.extname(req.file.originalname));
            var imgexte = path.extname(req.file.originalname);
            cloudinary.uploader.upload(
              "D:\\Software Project\\recaux\\assets\\avatar\\" +
                req.params.id +
                imgexte,
              {
                tags: "basic_sample",
                folder: "recaux/avatar",
                public_id: req.params.id,
                sign_url: true
              },
              function(err, image) {
                console.log();
                console.log("** File Upload");
                if (err) {
                  console.warn(err);
                }
                console.log(
                  "* public_id for the uploaded image is generated by Cloudinary's service."
                );
                console.log("* " + image.public_id);
                console.log("* " + image.url);

                User.updateOne({_id:user.id},{$set:{avatarUrl:image.url}}).then(doc=>{
                  ress.status(200).json(image);
                }).catch(err=>{
                  
                })

                ress.status(200).json(image);

                // waitForAllUploads("pizza",err,image);
              }
            );

            console.log(req.file);
          }
        });
      }
    }
  )(req, res, next);
};

exports.cvupload = (req, ress,next) => {

  console.log('canid - '+req.params.id)

   var res = "";
   console.log(JSON.stringify(req.headers.authorization));
  passport.authenticate(
    "jwtstrategy",
    { session: false },
    (err, user, info) => {
      console.log(JSON.stringify(req.headers.authorization));
     

      console.log("baba yaga ZEEVEE");

      if (!user) {
        console.log('error - '+info)
        ress.status(401).json(info);
      } else {
        cvUpload(req, res, err => {
          if (err) {
           
            console.log('multer errorr-  '+JSON.stringify(err));

            if(err.code =="LIMIT_FILE_SIZE"){
              ress.status(400).send("file_too_large")
            }
            if(err.msg =="unsupported_format"){
              ress.status(400).send("unsupported_file_format")
            }
 
          } else {
            console.log(path.extname(req.file.originalname));
            var cvexte = path.extname(req.file.originalname);
            cloudinary.uploader.upload(
              "D:\\Software Project\\recaux\\assets\\cv\\" +
                req.params.id +
                cvexte,
              {
                tags: "basic_sample",
                folder: "recaux/resume",
                public_id: req.params.id,
                sign_url: true
              },
              function(err, cvuploaddata) {
                console.log();
                console.log("** File Upload");
                if (err) {
                  console.warn(err);
                }
                console.log(
                  "* public_id for the uploaded pdf is generated by Cloudinary's service."
                );
                console.log("* " + cvuploaddata.public_id);
                console.log("* " + cvuploaddata.url);

                Candidate.updateOne({_id:req.params.id},{$set:{cvUrl:cvuploaddata.url}}).then(doc=>{
                  ress.status(200).json(cvuploaddata);
                }).catch(err=>{
                  
                }) 

                //ress.status(200).json(cvuploaddata);

                // waitForAllUploads("pizza",err,image);
              }
            );

            console.log(req.file);
          }
        });
      }
    }
  )
  (req, res, next);
};
