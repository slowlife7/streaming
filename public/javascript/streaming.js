
const fs = require('fs');
const path = require('path');
const errors = require("../javascript/error");

module.exports = function(rootpath) {

    const rootPath = rootpath;

    return {
        getStream : function(req, res, next) {
            const session = req.session;
            if(!session.userid) {
                next(new errors.HttpError(403, "인증에러"));
                return;
            }
            const file = path.join(rootPath, decodeURI(req.params.video));
            console.log('file:',file);
            fs.existsSync(file) || next(new errors.AppError(404, "찾을수 없음"));

            fs.stat(file, (err, stat) => {
                if (err) {
                    next(new errors.HttpError(404, "찾을수 없음"));
                    return;
                }

                let start = 0,
                    end = stat.size,
                    total = 0,
                    contentLength = stat.size;
                let contentRange = false;
                const range = req.header("Range");
                if (range) {
                    const position = range.replace(/bytes=/, "").split("-");
                    start = parseInt(position[0], 10);
                    total = stat.size;
                    end = position[1] ? parseInt(position[1], 10) : total - 1;
                    contentRange = true;
                    contentLength = end - start + 1;
                }
            
                if (start <= end) {
                    if (contentRange) {
                        res.status(206).set({
                            "Accept-Ranges": "bytes",
                            "Content-Length": contentLength,
                            "Content-Type": "video/mp4",
                            "Content-Range": "bytes " + start + "-" + end + "/" + total
                        });
                    } else {
                        res.status(200).set({
                            "Accept-Ranges": "bytes",
                            "Content-Length": contentLength,
                            "Content-Type": "video/mp4"
                        });
                    }

                    let st = fs
                    .createReadStream(file, { start: start, end: end })
                    .on("end", function() {
                      res.end();
                    })
                    .on("error", function(err) {
                      res.end();
                    })
                    .pipe(res,{ end: true });
                } else {
                    next(new errors.HttpError(404, "찾을수 없음"));
                }
            });
        }
    }
}