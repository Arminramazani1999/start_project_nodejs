// const validator = require('./validator');
const { body } = require("express-validator");

class AuthValidator {
  create() {
    return [body("title", "نام نمیتواند خالی باشد").notEmpty()];
  }
}

module.exports = new AuthValidator();
