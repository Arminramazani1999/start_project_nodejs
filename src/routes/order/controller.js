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
    const totalPrices = Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await this.OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = (await totalPrices).reduce((a, b) => a + b, 0);
    order = new this.Order({
      orderItem: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      phone: req.body.phone,
      zip: req.body.zip,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    await order.save();
    this.respons({
      res,
      message: "با موفقیت ثبت شد",
      data: order,
    });
  }
  // show all
  async getAll(req, res) {
    let orderList = await this.Order.find({})
      .populate(["user", { path: "orderItems", populate: "product" }])
      .sort({ dateOrdered: -1 });
    if (!orderList) {
      this.respons({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }

    this.respons({
      res,
      message: "All:",
      data: { orderList },
    });
  }
  // detaile
  async seeOne(req, res) {
    let order = await this.Order.findById(req.params.id).populate([
      "user",
      {
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      },
    ]);
    if (!order) {
      this.respons({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
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
        message: "سفارشی وجود ندارد",
      });
    }
    order = await this.Order.findByIdAndDelete(req.params.id).then(
      async (order) => {
        await order.orderItem.map(async (orderItem) => {
          await this.OrderItem.findByIdAndDelete(orderItem);
        });
      }
    );
    this.respons({
      res,
      message: " سفارش حذف شد",
      data: { order },
    });
  }
  async getTotalSales(req, res) {
    const totalSales = await this.Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      this.respons({
        res,
        code: 400,
        message: "The order sales connot be generated",
      });
    }
    res.send({
      totalsales: totalSales.pop().totalsales,
    });
  }

  
  //update
  async update(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.respons({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }
    order = await this.Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    this.respons({
      res,
      message: "سفارش بروز شد",
      data: { order },
    });
  }
}

module.exports = new AuthController();
