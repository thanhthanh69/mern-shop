const Users = require("../models/user.model");
const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id,
    });
    if (user.role === "user")
      return res.status(400).json({
        msg: "user is not admin",
      });
    next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = authAdmin;
