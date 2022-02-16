
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('HEAD', function(){
it('should default to GET', function(done){
var app = express();

app.get('/tobi', function(req, res){

res.send('tobi');
