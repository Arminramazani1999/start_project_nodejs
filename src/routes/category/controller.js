const controller = require("../controller");
// const User = require("models/user");
const { validationResult } = require("express-validator");

class CategoryController extends controller {
  // create
  async create(req, res) {
    let category = await this.Category.findOne({ title: req.body.title });
    if (category) {
      return this.response({
        res,
        code: 400,
        message: "دسته بندی قبلا وجود دارد",
      });
    }
    category = new this.Category({
      title: req.body.title,
      parent: req.body.parent,
      img: req.body.img,
    });
    await category.save();
    this.response({
      res,
      message: "با موفقیت ثبت نام شد",
      data: category,
    });
  }
  // show all
  async getAll(req, res) {
    let category = await this.Category.find({});
    this.response({
      res,
      message: "All:",
      data: { category },
    });
  }
  // see one
  async seeOne(req, res) {
    let category = await this.Category.findById(req.params.id);
    if (!category) {
      this.response({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    this.response({
      res,
      message: "",
      data: { category },
    });
  }
  // delete
  async delete(req, res) {
    let category = await this.Category.findById(req.params.id);
    if (!category) {
      this.response({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    category = await this.Category.findByIdAndDelete(req.params.id);
    this.response({
      res,
      message: "دسته بندی حذف شد",
      data: { category },
    });
  }
  //update
  async update(req, res) {
    let category = await this.Category.findById(req.params.id);
    if (!category) {
      this.response({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    category = await this.Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.response({
      res,
      message: "دسته بندی حذف شد",
      data: { category },
    });
  }
}

module.exports = new CategoryController();
