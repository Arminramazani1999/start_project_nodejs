const autoBindI = require("auto-bind-inheritance");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
const Order = require("../models/order");
const OrderItem = require("../models/order_item");

class Controller {
  constructor() {
    autoBindI(this);
    this.User = User;
    this.Category = Category;
    this.Product = Product;
    this.Order = Order;
    this.OrderItem = OrderItem;
  }
  validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((err) => err.msg);
      res.status(400).json({
        message: "validation error",
        data: errors,
      });
    }
  }
  validate(req, res, next) {
    if (this.validationBody(req, res)) {
      return;
    }
    next();
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
}

module.exports = Controller;
