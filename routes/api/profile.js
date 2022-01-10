const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const passport = require("passport");
const router = express.Router();

// Load user model
const User = require("../../models/User");

// @route   Get request api/profile/test
// @desc    Testing
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Profile API works",
  });
});

// @route   Post method api/profile/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  let status = true;
  User.findOne({ login: req.body.login }).then((login) => {
    if (login) {
      status = false;
      return res
        .status(400)
        .json({ msg: "login jest juz zajęty, wybierz inny." });
    }
  });

  User.findOne({ phone: req.body.phone }).then((phone) => {
    if (phone) {
      status = false;
      return res
        .status(400)
        .json({ msg: "Ten numer telefonu jest powiązany z innym kontem." });
    }
  });

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      status = false;
      return res
        .status(400)
        .json({ msg: "e-mail jest juz zajęty, wybierz inny" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      if (status) {
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
              .then((user) =>
                res.json({
                  id: user.id,
                  login: user.login,
                  email: user.email,
                  phone: user.phone,
                  avatar: user.avatar,
                  city: user.city,
                })
              )
              .catch((err) => console.error(err));
          });
        });
      } else {
        return res.status(400).json({ msg: "Wprowadz inne unikalne dane." });
      }
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
          jwt.sign(payload, "secret", (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
          return;
        } else {
          return res.status(400).json({ msg: "Błędny login lub hasło" });
        }
      });
    });
  }
});

// @route   Get request api/profile/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      login: req.user.login,
      email: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      city: req.user.city,
    });
  }
);

// @route   Get request api/profile/:login
// @desc    Get user by id
// @access  Public
// router.get("/:id", (req, res) => {
//   let errors = {};
//   User.findOne({ author_id: req.body.author_id })
//     .then((user) => {
//       if (!user) {
//         errors.profile = "Nie ma użytkownika o takim identyfikatorze";
//         res.status(404).json(errors);
//       }
//       res.json({
//         id: user.id,
//         login: user.login,
//         email: user.email,
//         phone: user.phone,
//         avatar: user.avatar,
//         city: user.city,
//       });
//     })
//     .catch((err) => res.status(404).json(err));
// });

router.get("/:id", (req, res) => {
  let errors = {};
  User.findOne({ _id: req.params.id.slice(1) })
    .then((user) => {
      if (!user) {
        errors.profile = "Nie ma użytkownika o takim identyfikatorze";
        res.status(404).json(errors);
      }
      res.json({
        id: user.id,
        login: user.login,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
      });
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
