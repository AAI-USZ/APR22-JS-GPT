
var express = require('../')
, request = require('./support/http')
, utils = require('../lib/utils')
, assert = require('assert');

var app = express();

app.use(function(req, res, next){
res.respondTo({
'text/plain': function(){
res.send('hey');
},
