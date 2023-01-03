const { Router } = require("express");
const {
  handleRegister,
  handleLogin,
  registerUser,
  authUser,
  logout,
} = require("../controllers/userController");

const router = Router();

router.route("/signup").get(handleRegister).post(registerUser);
router.route("/login").get(handleLogin).post(authUser);
router.get("/logout", logout);

module.exports = router;
