const controller = require("../controller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

class ProductController extends controller {
  // create
  async create(req, res) {
    const category = await this.Category.findOne({ id: req.body.id });
    if (!category) {
      return this.response({
        res,
        code: 400,
        message: "دسته بندی وجود ندارد",
      });
    }
    let product = await this.Product.findOne({ title: req.body.title });
    if (product) {
      return this.response({
        res,
        code: 400,
        message: "محصول قبلا وجود دارد",
      });
    }
    product = new this.Product({
      title: req.body.title,
      category: req.body.category,
      img: req.body.img,
      text: req.body.text,
      brand: req.body.brand,
      price: req.body.price,
      size: req.body.size,
      color: req.body.color,
      constInStock: req.body.constInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    });

    await product.save();
    this.response({
      res,
      message: "با موفقیت ثبت شد",
      data: { product },
    });
  }
  // show all
  async getAll(req, res) {
    const pageNumber = req.query.page || 1;
    const pageSize = 2;
    const search = req.query.search || "";

    let product = await this.Product.find({
      title: { $regex: search, $options: "i" },
    })
      .populate("category")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    this.response({
      res,
      message: "",
      data: { product },
    });
  }
  // see one
  async seeOne(req, res) {
    let product = await this.Product.findById(req.params.id);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول وجود ندارد",
      });
    }
    // view++
    product.view += 1;
    await product.save();
    this.response({
      res,
      message: "",
      data: { product },
    });
  }
  // delete
  async delete(req, res) {
    let product = await this.Product.findById(req.params.id);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول وجود ندارد",
      });
    }
    product = await this.Product.findByIdAndDelete(req.params.id);
    this.response({
      res,
      message: " محصول حذف شد",
      data: { product },
    });
  }
  //update
  async update(req, res) {
    let product = await this.Product.findById(req.params.id);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول وجود ندارد",
      });
    }
    product = await this.Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.response({
      res,
      message: " محصول حذف شد",
      data: { product },
    });
  }

  async getCount(req, res) {
    const productCount = await this.Product.countDocuments();
    if (!productCount) {
      this.response({
        res,
        code: 404,
        message: " محصولی وجود ندارد",
      });
    }
    res.send({
      productCount: productCount,
    });
  }
  async getFeatured(req, res) {
    const count = req.query.count ? req.query.count : 0;
    const product = await this.Product.find({ isFeatured: true }).limit(+count);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول برجسته ای وجود ندارد",
      });
    }
    this.response({
      res,
      message: "محصولات برجسته",
      data: { product },
    });
  }
}

module.exports = new ProductController();
