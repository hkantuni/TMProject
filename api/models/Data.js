const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  workTopic: { type: String, required: true },
  workedHours: { type: Number, required: true },
  hoursTotal: { type: Number },
  prefferedWorkingHoursPerDay: { type: Number },
  dateWorked: { type: Date, required: true, default: Date.now },
  comments: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Data", schema);
