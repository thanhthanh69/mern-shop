const express = require("express");
const route = express.Router();
const paymentCtrl = require("../controllers/payment.controller");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

route.get("/", auth, authAdmin, paymentCtrl.getPayments);
route.post("/", auth, paymentCtrl.createPayment);
module.exports = route;
