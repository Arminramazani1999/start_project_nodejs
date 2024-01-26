const controller = require("./../contriller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
class AuthController extends controller {
  // create
  async create(req, res) {

    const orderItemIds = Promise.all(
      req.body.orderItem.map(async (orderItem) => {
        let newOrderItem = new this.OrderItem({
          quantity: orderIten.quantity,
          product: orderIten.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    const orderItemsIdsResolved = await orderItemIds;

    order = new this.Order({
      orderItem: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      phone: req.body.phone,
      zip: req.body.zip,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    await order.save();
    this.respons({
      res,
      message: "با موفقیت ثبت نام شد",
      data: order,
    });
  }
  // show all
  async getAll(req, res) {
    let order = await this.Order.find({})
      .populate(["user", {path: "orderItems",  populate : "product"}])
      .sort({ dateOrdered: -1 });
    this.respons({
      res,
      message: "All:",
      data: { order },
    });
  }
  // see one
  async seeOne(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.respons({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    this.respons({
      res,
      message: "",
      data: { order },
    });
  }
  // delete
  async delete(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.respons({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    order = await this.Order.findByIdAndDelete(req.params.id);
    this.respons({
      res,
      message: "دسته بندی حذف شد",
      data: { order },
    });
  }
  //update
  async update(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.respons({
        res,
        code: 404,
        message: "دسته بندی وجود ندارد",
      });
    }
    order = await this.Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.respons({
      res,
      message: "دسته بندی حذف شد",
      data: { order },
    });
  }
}

module.exports = new AuthController();
