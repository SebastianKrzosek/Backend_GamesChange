const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const router = express.Router();

// Load user model
const User = require("../../models/User");

// @route   Get request api/profile/me
// @desc    Get info about profile
// @access  Private
router.get("/test", (req, res) => {
  res.json({
    msg: "my profile works",
  });
});

// @route   Post method api/profile/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ login: req.body.login }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ msg: "login jest juz zajęty, wybierz inny" });
    }
  });

  User.findOne({ phone: req.body.phone }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ msg: "Ten numer telefonu jest powiazany z innym kontem" });
    }
  });

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ msg: "e-mail jest juz zajęty, wybierz inny" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const newUser = new User({
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        avatar,
        city: req.body.city,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.error(err));
        });
      });
    }
  });
});

// @route   Post method api/profile/login
// @desc    Login user / returning JWT token
// @access  Public

router.post("/login", (req, res) => {
  const login = req.body.login;
  const email = req.body.email;
  const password = req.body.password;

  if (login) {
    User.findOne({ login }).then((user) => {
      //check for user
      if (!user) {
        return res.status(404).json({ msg: "Błędny login lub hasło" });
      }
      // check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // user matched
          const payload = {
            id: user.id,
            login: user.login,
            avatar: user.avatar,
          };
          // sign token
          jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          return res.status(400).json({ msg: "Błędny login lub haslo" });
        }
      });
    });
  }

  if (email) {
    User.findOne({ email }).then((user) => {
      //check for user
      if (!user) {
        return res.status(404).json({ msg: "Błędny login lub hasło" });
      }
      // check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // user matched
          const payload = {
            id: user.id,
            login: user.login,
            avatar: user.avatar,
          };
          // sign token
          jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          return res.status(400).json({ msg: "Błędny login lub haslo" });
        }
      });
    });
  }
  return res.status(400).json({ msg: "Wprowadź login lub email" });
});

module.exports = router;
