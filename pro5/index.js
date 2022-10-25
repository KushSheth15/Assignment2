require("./config/db").connect();
const Candidate = require("./model/candidate");
const express = require("express");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const { verify } = require("./middleware/auth");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
});
const upload = multer({ storage: storage });
app.get("/insert", (req, res) => {
  res.render("insert");
});

app.post("/submitdata", (req, res) => {
  console.log(req.body);
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(files);
    var cadidateData = {
      name: fields.name,
      email: fields.email,
      course:fields.course,
      password: bcrypt.hashSync(fields.password),
      profile: files.profile.name,
    };
    var oldpath = files.profile.path;
    var newpath = __dirname + "/public/uploads/" + files.profile.name;
    fs.copyFile(oldpath, newpath, (err) => {
      console.log(err);
    });
    Candidate.insertMany(cadidateData, (err) => {
      if (err) console.log(err);
    });
    res.redirect("/insert");
  });
});

app.get("/displaydata", verify, (req, res) => {
  Candidate.find({}, (err, data) => {
    if (err) console.log(err);
    else res.render("display", { details: data });
  });
});

app.get("/delete/:id", (req, res) => {
  Candidate.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/displaydata");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/loginsubmit", async (req, res) => {
  var data = await Candidate.findOne({ email: req.body.email });
  if (data) {
    const auth = await bcrypt.compare(req.body.password, data.password);
    if (auth) {
      let _token = jwt.sign({ email: data.email }, "privatekey", {
        expiresIn: 26000,
      });

      res.cookie("jwt", _token, { secure: false, httpOnly: true });

      res.redirect("displaydata");
    } else {
      res.send("Invalid data");
    }
  }
});
app.listen(4500, () => {
  console.log("Running on " + 4500);
});
