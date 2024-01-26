const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const passport = require("passport");
const uploadImages = require("../../upload/uploadImages");
const { isLoggined, isAdmin } = require("./../../midelweres/auth");

router.post(
  "/register",
  uploadImages.single("img"),
  (req, res, next) => {
    if (!req.file) {
      console.log("yes");
      req.body.img = null;
    } else {
      req.body.img = req.file.filename;
    }
    next();
  },
  validator.register(),
  controller.validate,
  (req, res, next) => {
    passport.authenticate("local.register", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(400).json({ error: info.message });
      }

      // Send a success response back to the client
      return res.status(200).json({ message: info.message, user: user });
    })(req, res, next);
  }
);
router.post("/login", validator.login(), controller.login);
// update
router.put("/:id", isLoggined, controller.update);

//---------admin------
// delete
router.delete("/:id", controller.delete);
// all
router.get("/", controller.getAll);
// see one
router.get("/:id", controller.seeOne);

module.exports = router;
