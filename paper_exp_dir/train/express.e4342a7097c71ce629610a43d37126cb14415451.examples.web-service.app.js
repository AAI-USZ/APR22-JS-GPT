


var express = require('../../lib/express');

var app = express.createServer();












app.use('/api/v1', function(req, res, next){
var key = req.query['api-key'];
