import Razorpay from "razorpay";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/db.js";
import {generateAuthToken} from "../utils/generateAuthToken.js"
const { Order, User, dbConnect } = db;
const t = await dbConnect.transaction();

const ceateOrdercontroller = async (req, res) => {
  const secretkey = process.env.RAZERPAY_KEYID;
  try {
    const razorpayinstance = new Razorpay({
      key_id: secretkey,
      key_secret: process.env.RAZERPAY_SECRETKEY,
    });

    const createorder = await razorpayinstance.orders.create({
      amount: 2500,
      currency: "INR",
    });

    if (!createorder) {
      await t.rollback();
      return res.status(400).send({
        message: "order not created",
      });
    }
    await Order.create(
      {
        order_id: createorder.id,
        payment_id: "pending",
        status: "Pending",
      },
      { transaction: t }
    );

    await t.commit();
    return res
      .status(200)
      .send(
        new ApiResponse(
          201,
          { createorder, secretkey: secretkey },
          "order Created sucesully"
        )
      );
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const VerifyOrdercontroller = async (req, res) => {
  const t = await dbConnect.transaction();
  
  try {
    const { razorpay_payment_id, order_id } = req.body;

    const orderToUpdate = await Order.findOne({
      where: { order_id: order_id },
      transaction: t,
    });

    if (!orderToUpdate) {
      await t.rollback();
      return res.status(400).send({
        message: "Order not found",
      });
    }

    await orderToUpdate.update(
      {
        payment_id: razorpay_payment_id,
        status: "Completed",
      },
      { transaction: t }
    );

    const user = await User.findOne({
      where: { id: req.Userid },
      transaction: t,
    });

    if (!user) {
      await t.rollback();
      return res.status(400).send({
        message: "User not found",
      });
    }

    await user.update(
      {
        Ispremium: true,
      },
      { transaction: t }
    );

    const tokenvalue = {
      id: req.Userid,
      Ispremium: true,
    };
    const finaldata={}
  
    const token = await generateAuthToken(tokenvalue);
     finaldata.token=token
     finaldata.user=user
    await t.commit();
    
    return res
      .status(200)
      .send(new ApiResponse(200, finaldata, "Now you are a premium member"));
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};


export { ceateOrdercontroller, VerifyOrdercontroller };
