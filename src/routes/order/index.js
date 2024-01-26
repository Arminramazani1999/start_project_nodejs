const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const uploadImages = require("../../upload/uploadImages");

//----------admin---------
// create
router.post(
  "/create",
  uploadImages.single("img"),
  (req, res, next) => {
    if (!req.file) {
      req.body.img = null;
    } else {
      req.body.img = req.file.filename;
    }
    next();
  },
  validator.create(),
  controller.validate,
  controller.create
);
// delete
router.delete("/:id", controller.delete);
// update
router.put("/:id", controller.update);

//--------all_user------
// all
router.get("/", controller.getAll);
// see one
router.get("/:id", controller.seeOne);



module.exports = router;
