const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/refresh_token", userController.refreshToken);
router.get("/logout", userController.logout);
router.get("/infor", auth, userController.getUser);
router.get("/", userController.getUsers);
router.delete("/:id", userController.removeUser);
router.put("/:id", userController.updateUser);
router.patch("/updateCart", auth, userController.updateCart);
router.patch("/changePassword", auth, userController.changePassword);
module.exports = router;
