const controller = require("./../contriller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
class AuthController extends controller {
  // create
  async create(req, res) {
    console.log("cat");
    let category = await this.Category.findOne({ title: req.body.title });
    console.log(category)
    if (category) {
      console.log("cat2");
      return this.respons({
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
    console.log(category)
    this.respons({
      res,
      message: "با موفقیت ثبت نام شد",
      data:  category,
    });
  }
  // show all
  async getAll(req, res) {
    let category = await this.Category.find({});
    this.respons({
      res,
      message: "All:",
      data: { category },
    });
  }
  // see one
  async seeOne(req, res) {
    let category = await this.Category.findById(req.params.id);
    if (!category) {
      this.respons({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    this.respons({
      res,
      message: "",
      data: { category },
    });
  }
  // delete
  async delete(req, res) {
    let category = await this.Category.findById(req.params.id);
    if (!category) {
      this.respons({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    category = await this.Category.findByIdAndDelete(req.params.id);
    this.respons({
      res,
      message: "دسته بندی حذف شد",
      data: { category },
    });
  }
  //update
  async update(req, res) {
    let category = await this.Category.findById(req.params.id);
    if (!category) {
      this.respons({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    category = await this.Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.respons({
      res,
      message: "دسته بندی حذف شد",
      data: { category },
    });
  }
}

module.exports = new AuthController();
