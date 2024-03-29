const controller = require("../controller");
const path = require("path");
// const User = require("models/user");
const { validationResult } = require("express-validator");

class OrderController extends controller {
  // create
  async create(req, res) {
    const orderItemIds = Promise.all(
      req.body.orderItem.map(async (orderItem) => {
        let newOrderItem = new this.OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    const orderItemsIdsResolved = await orderItemIds;
    const totalPrices = Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await this.OrderItem.findById(orderItemId).populate(
          "product"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;

        let constInStock = orderItem.product.constInStock;
        console.log("constInStock = ", constInStock);
        return totalPrice;
      })
    );
    const totalPrice = (await totalPrices).reduce((a, b) => a + b, 0);

    const order = new this.Order({
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
    this.response({
      res,
      message: "با موفقیت ثبت شد",
      data: order,
    });
  }
  // show all
  async getAll(req, res) {
    let orderList = await this.Order.find({})
      .populate("user", "name")
      .populate({ path: "orderItem", populate: "product" })
      .sort({ dateOrdered: -1 });
    if (!orderList) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }

    this.response({
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
        path: "orderItem",
        populate: { path: "product", populate: "category" },
      },
    ]);
    if (!order) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }
    this.response({
      res,
      message: "",
      data: { order },
    });
  }
  // delete
  async delete(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.response({
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
    this.response({
      res,
      message: " سفارش حذف شد",
      data: { order },
    });
  }
  // get totalsales
  async getTotalSales(req, res) {
    const totalSales = await this.Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      this.response({
        res,
        code: 400,
        message: "The order sales connot be generated",
      });
    }
    res.send({
      totalsales: totalSales.pop().totalsales,
    });
  }
  // get count
  async getCount(req, res) {
    const orderCount = await this.Order.countDocuments();
    if (!orderCount) {
      this.response({
        res,
        code: 500,
        message: " سفارشی وجود ندارد",
      });
    }
    res.send({
      orderCount: orderCount,
    });
  }
  // get user orders
  async getUserOrders(req, res) {
    const userOrderList = await this.Order.find({ user: req.params.id })
      .populate([
        {
          path: "orderItem",
          populate: { path: "product", populate: "category" },
        },
      ])
      .sort({ dateOrdered: -1 });
    if (!userOrderList) {
      this.response({
        res,
        code: 500,
        message: " سفارشی وجود ندارد",
      });
    }
    res.send({
      userOrderList: userOrderList,
    });
  }

  //update
  async update(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.response({
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
    this.response({
      res,
      message: "سفارش بروز شد",
      data: { order },
    });
  }
}

module.exports = new OrderController();
