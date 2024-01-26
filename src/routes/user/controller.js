const controller = require("./../contriller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

class AuthController extends controller {
  async dashboard(req, res) {
    res.send("user dashboard");
  }


  async me(req, res) {
    const user = req.user;
    this.respons({
      res,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  }

}

module.exports = new AuthController();
