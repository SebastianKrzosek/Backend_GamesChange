const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Posts = require("../../models/Posts");

// @route   Get request api/posts/test
// @desc    wall posts
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "posts works",
  });
});

router.get("/wall", (req, res) => {
  Posts.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404));
});

router.post("/add", (req, res) => {
  const newPost = new Posts({
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    author_id: mongoose.Types.ObjectId(req.body.author_id),
  });
  newPost
    .save()
    .then((post) => res.json(post))
    .catch((err) => console.error(err));
});

router.post("/addguest", (req, res) => {
  const newPost = new Posts({
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
  });
  newPost
    .save()
    .then((post) => res.json(post))
    .catch((err) => console.error(err));
});

module.exports = router;
