const express = require("express");
const router = express.Router();
const Video = require("../model/video");
const queryapi = require("../public/javascript/queryAPI")(Video);

const COUNT_PER_PAGE = 12;
const COUNT_PAGINATION = 5;

const hasQuery = function(req) {
    return (Object.keys(req.query).length && req.query.hasOwnProperty('query'));
}

const hasPaging = function(req) {
    if(req.query.hasOwnProperty('pageNo'))
        return req.query.pageNo -1;
    return 0;     
}

router.get("/", (req, res, next) => {
    const pageNo = hasPaging(req);
    const exec = {
        condition: { },
        sort: { created: -1 },
        skip: pageNo * COUNT_PER_PAGE,
        limit: parseInt(COUNT_PER_PAGE),
        currentpage : parseInt(pageNo),
        maxpaging : parseInt(COUNT_PAGINATION)
    };

    req.exec = exec;

    if(hasQuery(req)) {
        next();
        return;
    }

    queryapi.findItems(exec)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    })

}, (req, res, next) => {
    const queryString = req.query.query;
    req.exec.condition = { title : { $regex: ".*"+queryString+".*"} };

    queryapi.findItems(req.exec)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    })
});

router.get("/:category", (req, res, next) => {
    const pageNo = hasPaging(req);
    const category = req.params.category;
    const exec = {
        condition: { category: category },
        sort: { created: -1 },
        skip: pageNo * COUNT_PER_PAGE,
        limit: parseInt(COUNT_PER_PAGE),
        currentpage : parseInt(pageNo),
        maxpaging : parseInt(COUNT_PAGINATION)
    };

    req.exec = exec;

    if(hasQuery(req)) {
        next();
        return;
    }
    
    queryapi.findItems(exec)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    })

}, (req, res, next) => {
    const queryString = req.query.query;
    const regx = { title : { $regex: ".*"+queryString+".*"} };
    req.exec.condition = { ...req.exec.condition, ...regx };

    queryapi.findItems(req.exec)
    .then( result => {
        res.json(result);
    })
    .catch( err => {
        next(err);
    })
});

module.exports = router;



