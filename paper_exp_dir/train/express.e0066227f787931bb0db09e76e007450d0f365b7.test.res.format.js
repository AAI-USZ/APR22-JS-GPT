
var express = require('../')
, request = require('supertest')
, assert = require('assert');

var app1 = express();

app1.use(function(req, res, next){
res.format({
'text/plain': function(){
res.send('hey');
},

