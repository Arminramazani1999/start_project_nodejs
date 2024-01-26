// const validator = require('./validator');
const { body } = require("express-validator");

class AuthValidator {
  register() {
    return [
      body("name", "نام نمیتواند خالی باشد").notEmpty(), //not().Empty()
      body("email", "ایمیل اشتباه است").isEmail(),
      body("password", "پسورد صحیح نیست").isLength({ min: 4 }), // body('phone', 'شماره موبایل صحیح نیست').isLength({ min: 11 })
    ];
  }

  login() {
    return [
      body("email", "ایمیل اشتباه است").isEmail(),
      body("password", "پسورد صحیح نیست").isLength({ min: 4 }), // body('phone', 'شماره موبایل صحیح نیست').isLength({ min: 11 })
    ];
  }
}

module.exports = new AuthValidator();
