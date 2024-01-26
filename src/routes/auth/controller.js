const controller = require("./../contriller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

class AuthController extends controller {
  async register(req, res) {
    let user = await this.User.findOne({ email: req.body.email }); // email = req.body.email
    if (user) {
      return this.respons({
        res,
        code: 400,
        message: "یوزر قبلا وجود دارد",
      });
    }
    user = new this.User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), //پسور را هش میکنیم یعنی به چند تا حروف و عدد رندوم تبدیل میکند
      img: req.body.img,
    });

    await user.save();
    this.respons({
      res,
      message: "با موفقیت ثبت نام شد",
      data: {
        name: user.name,
        id: user.id,
        email: user.email,
      },
    });
  }

  // login
  async login(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return this.respons({
        res,
        code: 400,
        message: "ایمیل یا پسورد اشتباه است",
      });
    }
    const token = jwt.sign({ _id: user.id }, config.get("jwt_key"), {
      expiresIn: "1d",
    });
    console.log(token);
    this.respons({
      res,
      message: "یوزر لاگین شد",
      data: { token },
    });
  }

  // show all
  async getAll(req, res) {
    let user = await this.User.find({});
    this.respons({
      res,
      message: "All:",
      data: { user },
    });
  }
  // see one
  async seeOne(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.respons({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    this.respons({
      res,
      message: "",
      data: { user },
    });
  }
  // delete
  async delete(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.respons({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    user = await this.User.findByIdAndDelete(req.params.id);
    this.respons({
      res,
      message: "کاربر حذف شد",
      data: { user },
    });
  }
  //update
  async update(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.respons({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    user = await this.User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.respons({
      res,
      message: "کاربر حذف شد",
      data: { user },
    });
  }
}

module.exports = new AuthController();
