const multer = require("multer");
const path = require("path");

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

const avatarUpload = multer({ storage: storageAvatar }).single("avatar");
const cvUpload = multer({ storage: storageCv }).single("cv");

exports.profileimgup = (req, res) => {
  avatarUpload(req, res, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.file);
    }
  });

  console.log("req came avatar");
};
exports.cvupload = (req, res) => {
  console.log("req came cv");

  cvUpload(req, res, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.file);
    }
  });

  console.log("req go cv");
};
