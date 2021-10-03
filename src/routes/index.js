const userRouter = require("./user.router");
const upload = require("./upload");
const destroy = require("./destroy");
const productRouter = require("./product.router");
const paymentRouter = require("./payment.router");
function router(app) {
  app.use("/users", userRouter);
  app.use("/upload", upload);
  app.use("/destroy", destroy);
  app.use("/products", productRouter);
  app.use("/payment", paymentRouter);
}

module.exports = router;
