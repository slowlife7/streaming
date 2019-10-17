const express = require("express");
const router = express.Router();
const errors = require("../public/javascript/error");
const user = require("../model/user");

router.get("/", (req, res, next) => {
  const session = req.session;
  if (session.userid) {
    res.json({ result: 1 });
  } else {
    next(new errors.AppError(401, "인증에러"));
  }
});

router.post("/login", (req, res, next) => {
  console.log("router login");
  const session = req.session;

  console.log(req.body);

  if (session.userid) {
    //res.redirect("/");
    res.json({ result: 1 });
  } else {
    user.findOne({ userid: req.body.userid }).then(result => {
      if (result == null) {
        console.log("r3");
        next(new errors.AppError(401, "인증에러"));
      } else if (result.passwd === req.body.password) {
        session.userid = req.body.userid;
        session.passwd = req.body.password;
        //res.redirect("/");
        res.json({ result: 1 });
      } else {
        //res.status(204).end();
        next(new errors.AppError(401, "인증에러"));
      }
    });
  }
});

router.get("/login", (req, res, next) => {
  const session = req.session;
  if (session.userid) {
    res.json({ result: 1 });
  } else {
    next(new errors.AppError(401, "인증에러"));
  }
});

router.get("/logout", (req, res, next) => {
  console.log('sessionid');
  if(req.session.userid) {
    res.json({ result: 1 });
    req.session.destroy();
  } else {
    next(new errors.AppError(403, "금지됨"));
  }
});
module.exports = router;
