const express = require("express");
const route = express.Router();
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const productController = require("../controllers/product.controller");

route.post("/", productController.createProduct);
route.get("/", productController.getProducts);
route.delete("/:id", productController.deleteProduct);
route.put("/:id", productController.updateProduct);
module.exports = route;
