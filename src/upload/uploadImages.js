// کد های مربوط که فایل هایی که قرار است ذخیره بشوند

const multer = require("multer");
const mkdir = require("mkdirp");

const storage = multer.diskStorage({
  // فایلمون کجا ذخیره بشود
  destination: function (req, file, cb) {
    // اگر همچین فولدر وجود نداشت انرا میسازد
    mkdir.mkdirp("./public/uploads/images").then((made) => {
      cb(null, "./public/uploads/images");
    });
  },
  // فایلمون با چه اسمی ذخیره بشود
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); //Date.now()
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
