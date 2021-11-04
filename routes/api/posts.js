const express = require("express");
const router = express.Router();

// @route   Get request api/posts/test
// @desc    wall posts
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "posts works",
  });
});

module.exports = router;
