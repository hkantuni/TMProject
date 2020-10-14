const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User");
const Data = require("../models/Data");
const auth = require("../middleware/auth.middleware");

const router = Router();

router.get("/userpage", auth, async (req, res) => {
  const role = req.user.userRole;
  const { email } = req.query;

  let matched = {};
  if (email) {
    matched = {
      ...matched,
      email,
    };
  }

  try {
    let userData = [];
    if (role === "admin") {
      userData = await User.find(
        { ...matched },
        {
          email: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
        }
      ).sort({ email: 1 });
    } else if (role === "manager") {
      userData = await User.find(
        {
          ...matched,
          $and: [{ role: "user" }],
        },
        {
          email: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
        }
      ).sort({ email: 1 });
    }

    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.delete("/userpage/:id", auth, async (req, res) => {
  try {
    await Data.deleteMany({
      owner: new mongoose.Types.ObjectId(req.params.id),
    });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User Removed" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/edituser/:id", auth, async (req, res) => {
  const role = req.user.userRole;
  const { id } = req.params;

  let matched = {};
  if (id) {
    matched = {
      ...matched,
      _id: new mongoose.Types.ObjectId(id),
    };
  }

  try {
    let userData = [];
    if (role === "admin") {
      userData = await User.find(
        { ...matched },
        {
          email: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
        }
      );
    } else if (role === "manager") {
      userData = await User.find(
        {
          ...matched,
          $and: [{ role: "user" }],
        },
        {
          email: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
        }
      );
    }
    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.put("/edituser/:id", auth, async (req, res) => {
  console.log("aaa", req.params);
  try {
    await User.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
    });

    res.status(200).json({ message: "User updated" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

module.exports = router;
