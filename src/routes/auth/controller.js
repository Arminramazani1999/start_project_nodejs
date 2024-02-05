const controller = require("./../contriller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

class AuthController extends controller {
  // login
  async login(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return this.response({
        res,
        code: 400,
        message: "ایمیل یا پسورد اشتباه است",
      });
    }
    const token = jwt.sign({ _id: user.id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    this.response({
      res,
      message: "یوزر لاگین شد",
      data: { token },
    });
  }

  // show all
  async getAll(req, res) {
    let user = await this.User.find({});
    this.response({
      res,
      message: "All:",
      data: { user },
    });
  }
  // see one
  async seeOne(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.response({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    this.response({
      res,
      message: "",
      data: { user },
    });
  }
  // delete
  async delete(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.response({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    user = await this.User.findByIdAndDelete(req.params.id);
    this.response({
      res,
      message: "کاربر حذف شد",
      data: { user },
    });
  }
  //update
  async update(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.response({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    user = await this.User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.response({
      res,
      message: "کاربر حذف شد",
      data: { user },
    });
  }
}

module.exports = new AuthController();
