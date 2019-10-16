const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const moment = require('moment');

const postRouter = require('./route/post');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rasgo.iptime.org:27017/toapp6', {useNewUrlParser: true})
.then( () => { console.log('=====>Succeeded in connecting..'); } )
.catch( (err) => { console.log(err); })

const app = express();
const logDirectory = path.join(__dirname, 'access_log');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs(moment(Date.now()).format('YYYYMMDD')+'.log', {
    interval : '1d',
    path : logDirectory
});

app.use(morgan(':remote-addr - :date[clf] :method :url HTTP/:http-version :status'));
app.use(morgan(':remote-addr - :date[clf] :method :url HTTP/:http-version :status', { stream : accessLogStream }));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.use('*.ico', FaviconHandler);
app.use('/posts', postRouter);
app.use(ErrorHandler);
app.use(CatchError);

app.listen(3000, function() {
	console.log('app listening on port 3000!');
});


function FaviconHandler(req, res, next) {
  console.log('favicon');
  console.log(req.path);
  res.status(200).end();
}

function ErrorHandler(req, res, next) {
	console.log('Can not found any router!!!!');
	res.status(404).end();
}

function CatchError(err, req, res, next) {
    console.log(err);
	console.log('Can not found any router');
	res.status(500).end();
}

