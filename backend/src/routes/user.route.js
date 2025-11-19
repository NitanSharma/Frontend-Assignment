const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/register", async (req, res) => {
  // Validate body (express-validator)
  // Validate error
  // Extracte body
  // isUserExisted and validate
  // hashed password
  // createUser
  // generate token
  //  res.status(201).json({token , user});

  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  const isUserExisted = await User.findOne({ email });

  if (isUserExisted) {
    return res.status(400).json({ error: "User Already Exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  console.log(user);
  console.log(token);
  res.status(201).json({ token, user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

//   console.log(req.body);
  // email checking
  // password check and compare with bcryt
  // send token in cookie

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ token, user });
});

router.get('/profile' , authUser , (req,res) => {
    res.status(200).json(req.user);
})

router.get('/logout' , authUser , (req,res) => {
     res.clearCookie('token');
    res.status(200).json({message : 'User Logged Out'});
})


module.exports = router;

