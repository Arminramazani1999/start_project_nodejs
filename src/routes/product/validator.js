// const validator = require('./validator');
const { body } = require("express-validator");

class AuthValidator {
  create() {
    return [
      body("category", "دسته بندی نمیتواند خالی باشد").notEmpty(), 
      body("title", "نام نمیتواند خالی باشد").notEmpty(), 
      body("text", "text نمیتواند خالی باشد").notEmpty(), 
      body("price", "قیمت نمیتواند خالی باشد").notEmpty(), 
      body("color", "رنگ نمیتواند خالی باشد").notEmpty(), 
    ];
  }
}

module.exports = new AuthValidator();
