const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.post("/register", async (req, res) => {
  let { username, name, password, age, email } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("user already exists");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        name,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email: user.email, userid: user._id }, "shhhhh");
      res.cookie("token", token);
      res.status(200).send("registered");
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });

  if (!user) return res.status(500).res.send("user don't exist");

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email }, "shhh");
      res.cookie("token", token);
      res.status(200).send("you are logged in");
    } else res.redirect("/login");
  });
});

function isLogin(req, res, next) {
  if (req.cookies.token === "") {
    res.send("you need to be logged in to get access of this profile");
  }
  next();
}

app.listen(4000);
