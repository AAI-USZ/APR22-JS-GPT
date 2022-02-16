









var express = require('../..');
var path = require('path');
var redis = require('redis');

var db = redis.createClient();



var app = express();

app.use(express.static(path.join(__dirname, 'public')));
