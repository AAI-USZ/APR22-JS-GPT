


var express = require('../../')
, logger = require('morgan')
, app = module.exports = express()
, test = app.get('env') == 'test';

if (!test) app.use(logger('dev'));







function error(err, req, res, next) {

if (!test) console.error(err.stack);


