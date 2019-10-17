const express = require("express");
const router = express.Router();
const streaming = require("../public/javascript/streaming")('/home/bear/video');

router.get("/:video", (req, res, next) => {

    console.log('video..');
    const session = req.session;
    if (session.userid) {
        streaming.getStream(req, res, next);
    } else {
        console.log('aaaa');
      next(new errors.AppError(401, "인증에러"));
    }
});

module.exports = router;