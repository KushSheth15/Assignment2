const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/Onlinejob", { useNewUrlParser: true })
    .then(() => console.log("connection established"))
    .catch((err) => console.log(err));
};
