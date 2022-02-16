
var express = require('../')
, request = require('supertest')
, assert = require('assert');
var utils = require('./support/utils');

describe('res', function(){
describe('.jsonp(object)', function(){
it('should respond with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});
