
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.json(object)', function(){
describe('when given primitives', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json(null);
});

