const mongoose = require("mongoose");

const Candidate = new mongoose.Schema({
  email: { type: String, default: null },
  name: { type: String, default: null },
  profile: { type: String, default: null },
  password: { type: String, default: null },
  course : {type:String , default:null}
});

module.exports = mongoose.model("Candidate", Candidate);
