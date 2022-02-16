

var express = require('../../');
var logger = require('morgan');
var app = module.exports = express();
var test = app.get('env') == 'test';

if (!test) app.use(logger('dev'));







function error(err, req, res, next) {

if (!test) console.error(err.stack);
