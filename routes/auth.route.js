var express = require("express");
var router = express.Router();
const authController = require("../controller/auth.controller");

/* GET login page */
router.get("/login", authController.showLogin);

/* POST login form */
router.post("/login", authController.login);

/* API Login  */
router.post("/signin", authController.signin);

/* GET register page */
router.get("/register", authController.showRegister);

/* POST register form */
router.post("/register", authController.register);

/* GET logout */
router.get("/logout", authController.logout);

module.exports = router;
