
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.json(object)', function(){
describe('when "jsonp callback" is enabled', function(){
it('should respond with jsonp', function(done){
var app = express();

app.enable('jsonp callback');
app.use(function(req, res){
res.json({ count: 1 });
});

request(app)
.get('/?callback=something')
.end(function(res){
