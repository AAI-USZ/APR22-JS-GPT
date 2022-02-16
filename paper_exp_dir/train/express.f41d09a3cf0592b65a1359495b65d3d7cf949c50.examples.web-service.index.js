


var express = require('../../');

var app = module.exports = express();





function error(status, msg) {
var err = new Error(msg);
err.status = status;
return err;
}










app.use('/api', function(req, res, next){
var key = req.query['api-key'];


if (!key) return next(error(400, 'api key required'));


if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));


req.key = key;
next();
});






var apiKeys = ['foo', 'bar', 'baz'];



var repos = [
{ name: 'express', url: 'http://github.com/visionmedia/express' }
, { name: 'stylus', url: 'http://github.com/learnboost/stylus' }
, { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];

var users = [
{ name: 'tobi' }
