


var express = require('../../')
, app = module.exports = express();

if ('test' != process.env.NODE_ENV)
app.use(express.logger('dev'));
app.use(app.router);





app.use(error);







function error(err, req, res, next) {

if ('test' != process.env.NODE_ENV)
