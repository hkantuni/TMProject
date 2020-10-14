const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("firstName", "First Name field is empty").exists(),
    check("lastName", "Last Name field is empty").exists(),
    check("password", "Minimum password length is 6 characters").isLength({
      min: 3,
      //TODO
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req); // validating check email and pass and sends error
      if (!errors.isEmpty()) {
        // checking if errors are not empty and if so returning error ststus 400 to json
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect credentials while registering",
        });
      }

      const { firstName, lastName, email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "This user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      await user.save();
      res.status(201).json({ message: "User created" });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Please enter correct email").isEmail(),
    check("password", "Please enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req); // validating check email and pass and sends error
      if (!errors.isEmpty()) {
        // checking if errors are not empty and if so returning error ststus 400 to json
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect credentials",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Incorrect password, please try again" });
      }

      // sozdaem token, peredaem userId, jwtsecret
      const token = jwt.sign(
        { userId: user.id, userRole: user.role },
        config.get("jwtSecret"),
        {
          expiresIn: "10h",
        }
      );

      res.json({ token, userId: user.id, userRole: user.role });
    } catch (e) {
      console.log("e", e);
      res
        .status(500)
        .json({ message: "Something went wrong, please try again" });
    }
  }
);

module.exports = router;
