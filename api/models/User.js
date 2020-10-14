const { Schema, model, Types } = require("mongoose");
const Data = require("./Data");

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  links: [{ type: Types.ObjectId, ref: "Link" }],
});

// schema.pre("remove", async (next) => {
//   console.log("aaa", this._id, this);
//   try {
//     await Data.remove({ owner: new mongoose.Types.ObjectId(this._id) });
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = model("User", schema);
