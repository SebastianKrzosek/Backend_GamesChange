const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Posts = require("../../models/Posts");

// @route   Get request api/posts/wall
// @desc    wall posts
// @access  Public
router.get("/wall", (req, res) => {
  Posts.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404));
});

// @route   Post method api/posts/add
// @desc    add post by logged user
// @access  Public
router.post("/add", upload.single("photo"), (req, res) => {
  const newPost = new Posts({
    _id: new mongoose.Types.ObjectId(),
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    photo: req.file.path,
    author_id: mongoose.Types.ObjectId(req.body.author_id),
  });
  newPost
    .save()
    .then((post) => res.json(post))
    .catch((err) => console.error(err));
});

// @route   Post method api/posts/addguest
// @desc    add post by guest
// @access  Public
router.post("/addguest", upload.single("photo"), (req, res) => {
  const newPost = new Posts({
    _id: new mongoose.Types.ObjectId(),
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    photo: req.file.path,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
  });
  newPost
    .save()
    .then((post) => {
      res.json(post);
    })
    .catch((err) => console.error(err));
});

// @route   Get request api/posts/:id
// @desc    Get users posts by id
// @access  Public
router.get("/:id", (req, res) => {
  let errors = {};
  Posts.find({ author_id: req.body.author_id })
    .then((posts) => {
      if (!posts) {
        errors.posts = "Użytkownik o takim id nie ma zadnych postow";
        res.status(404).json(errors);
      }
      res.json(posts);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   Delete request api/posts/delete
// @desc    Delete time-outed posts
// @access  Public
router.delete("/delete", (req, res) => {
  let now = Date.now();
  let diff;

  Posts.find()
    .sort({ date: -1 })
    .then((posts) => {
      posts.map((post) => {
        diff = Math.floor((now - post.date) / (1000 * 60 * 60 * 24));
        console.log(diff);
        // if (diff > 8) {
        //   post.remove();
        // }
      });
      res.json({ success: true });
    })
    .catch((err) => res.status(err));
});

module.exports = router;
