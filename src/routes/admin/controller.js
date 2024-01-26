const controller = require("../contriller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

class AuthController extends controller {
  async dashboard(req, res) {
    res.send("admin dashboard");
  }
}

module.exports = new AuthController();
