const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", (req, res, next) => {
  fs.readFile(path.join(__dirname, "../views", "index.html"), (err, data) => {
    if (err) {
      next(err);
      return;
    }
    res.end(data);
  });
});

module.exports = router;
