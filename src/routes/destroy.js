const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(500).json({ msg: "No image selected" });
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Deleted image" });
    });
  } catch (error) {
    return res.status(500).json(err);
  }
});

const removeTmp = (path) => {
  fs.unlink((path, err) => {
    if (err) throw err;
  });
};
module.exports = router;
