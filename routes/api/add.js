const express = require("express");
const router = express.Router();

// @route   Post request api/add/test
// @desc    add wall posts
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "add works",
  });
});

module.exports = router;
