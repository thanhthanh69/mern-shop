require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 4000;
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/index");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
// app config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// connect mongoDB
const DB_URL = process.env.DATABASE_URL;
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected DB");
  })
  .catch((err) => {
    console.log(err);
  });

// router
router(app);

app.listen(process.env.PORT || 4000);
