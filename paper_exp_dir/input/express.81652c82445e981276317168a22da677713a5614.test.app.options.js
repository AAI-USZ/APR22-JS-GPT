
var express = require('../')
, request = require('./support/http');

describe('OPTIONS', function(){
it('should default to the routes defined', function(done){
var app = express();

