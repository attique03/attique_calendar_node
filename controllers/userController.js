const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const handleErrors = require("../utils/errorHandler");
const { createToken, maxAge } = require("../utils/generateToken");

const handleRegister = (req, res) => {
  res.render("signup", { title: "Register" });
};

const handleLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        console.log("Auth: ", auth);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
      } else {
        throw Error("incorrect password");
      }
    } else {
      throw Error("incorrect email");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  handleRegister,
  handleLogin,
  registerUser,
  authUser,
  logout,
};
