const jwt = require("jsonwebtoken");

exports.verify = (req, res, next) => {
  const _token = req.cookies.jwt;
  try {
    jwt.verify(_token, "privatekey", (err, token) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } catch (err) {
    console.log(err);
  }
};
