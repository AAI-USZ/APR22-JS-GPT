

var express = require('../..');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var format = require('util').format;

var app = module.exports = express();

app.use(bodyParser());
app.use(function(req, res, next){
console.log(req.method);
if(req.method === 'POST' && req.headers['content-type'].indexOf("multipart/form-data") !== -1){
var form = new multiparty.Form();
