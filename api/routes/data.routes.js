const mongoose = require("mongoose");
const { Router } = require("express");
const Data = require("../models/Data");
const auth = require("../middleware/auth.middleware");

const router = Router();

router.post("/timepage", auth, async (req, res) => {
  try {
    const {
      workTopic,
      workedHours,
      hoursTotal,
      prefferedWorkingHoursPerDay,
      dateWorked,
      comments,
    } = req.body;

    const data = new Data({
      workTopic,
      workedHours,
      hoursTotal,
      prefferedWorkingHoursPerDay,
      dateWorked,
      comments,
      owner: req.user.userId,
    });

    await data.save();
    res.status(200).json({ message: "Data Added" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/", auth, async (req, res) => {
  const { dateFrom, dateTo, email } = req.query;

  try {
    let matched =
      req.user.userRole === "admin"
        ? {}
        : { owner: new mongoose.Types.ObjectId(req.user.userId) };

    if (dateFrom && dateTo) {
      matched = {
        ...matched,
        dateWorked: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
      };
    }

    let data = await Data.aggregate([
      { $match: matched },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      {
        $project: {
          workTopic: 1,
          workedHours: 1,
          hoursTotal: 1,
          prefferedWorkingHoursPerDay: 1,
          dateWorked: 1,
          comments: 1,
          ownerInfo: {
            email: 1,
          },
        },
      },
      { $sort: { dateWorked: 1 } },
    ]);

    if (email) {
      data = data.filter((record) => record.ownerInfo[0].email === email);
    }

    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const matched =
      req.user.userRole === "admin"
        ? { _id: new mongoose.Types.ObjectId(req.params.id) }
        : {
            $and: [
              { _id: new mongoose.Types.ObjectId(req.params.id) },
              { owner: new mongoose.Types.ObjectId(req.user.userId) },
            ],
          };

    const data = await Data.aggregate([
      { $match: matched },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      {
        $project: {
          workTopic: 1,
          workedHours: 1,
          hoursTotal: 1,
          prefferedWorkingHoursPerDay: 1,
          dateWorked: 1,
          comments: 1,
          ownerInfo: {
            email: 1,
          },
        },
      },
    ]);

    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    await Data.findByIdAndUpdate(req.params.id, {
      workTopic: req.body.workTopic,
      workedHours: req.body.workedHours,
      hoursTotal: req.body.hoursTotal,
      prefferedWorkingHoursPerDay: req.body.prefferedWorkingHoursPerDay,
      dateWorked: req.body.dateWorked,
      comments: req.body.comments,
    });
    res.status(200).json({ message: "Data Added" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Data Removed" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

module.exports = router;
