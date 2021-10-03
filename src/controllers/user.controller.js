const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../models/user.model");
const bcrypt = require("bcrypt");

class userController {
  // [POST] register user
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!email || !password || !name)
        return res.status(400).json({ msg: "Vui lòng nhập đầy đủ" });
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "Email đã có người đăng kí." });

      if (password.length < 6)
        return res.status(400).json({ msg: "Mật khẩu phải dài hơn 6 kí tự." });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
        role,
      });

      // Save mongodb
      await newUser.save();

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/users/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ msg: "Vui lòng nhập đầy đủ email và mật khẩu" });
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Không tồn tại email." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu." });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/users/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken, user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async logout(req, res) {
    try {
      res.clearCookie("refreshtoken", { path: "/users/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  refreshToken(req, res) {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async getUser(req, res) {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async getUsers(req, res) {
    try {
      const { _limit, _page } = req.query;
      const startIndex = (_page - 1) * _limit;
      const endIndex = _page * _limit;
      let users = await Users.find();
      const totalRows = users.length;
      if (startIndex || endIndex) {
        users = users.slice(startIndex, endIndex);
      }
      res.json({
        users,
        pagination: {
          _limit: Number(_limit),
          _page: Number(_page),
          _totalRows: Number(totalRows),
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  async removeUser(req, res) {
    try {
      await Users.findByIdAndRemove(req.params.id);
      res.json({ msg: "remove user" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { email, name, password, role } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      if (!email || !name || !password || !role)
        return res.status(400).json({ msg: "Please enter in full" });
      await Users.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name,
          email,
          password: passwordHash,
          role,
        },
        { new: true }
      );
      res.json({ msg: "updated user" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async updateCart(req, res) {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "updated to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { old_password, new_password, re_new_password } = req.body;
      if (!old_password || !new_password || !re_new_password)
        return res.status(400).json({ msg: "Vui lòng nhập đầy đủ" });
      const user = await Users.findById(req.user.id);
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) res.status(400).json({ msg: "Mật khẩu không chính xác" });
      if (new_password !== re_new_password)
        res.status(400).json({ msg: "Mật khẩu mới không khớp nhau" });
      if (new_password.length < 6)
        return res.status(400).json({ msg: "Mật khẩu phải dài hơn 6 kí tự." });
      const passwordHash = await bcrypt.hash(new_password, 10);
      await Users.findByIdAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        },
        { new: true }
      );
      return res.json({ msg: "thay đổi mật khẩu thành công" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = new userController();
