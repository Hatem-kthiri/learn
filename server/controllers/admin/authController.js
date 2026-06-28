const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");

exports.login = (req, res) => {
  const { email, password } = req.body;

  Admin.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return res.status(401).json({ status: false, message: "Wrong email" });
      }
      comparePasswordAndLogin(admin);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "An error occurred" });
    });

  function comparePasswordAndLogin(user) {
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) throw err;
      if (passwordMatch === true) {
        jwt.sign(
          { email: user.email, fullName: user.fullName },
          process.env.SECRETKEY,
          { expiresIn: "7d" },
          (err, token) => {
            if (err) throw err;
            res.json({
              status: true,
              message: "Logged in successfully",
              data: { token },
            });
          }
        );
      } else {
        res.status(401).json({ status: false, message: "Wrong password" });
      }
    });
  }
};
