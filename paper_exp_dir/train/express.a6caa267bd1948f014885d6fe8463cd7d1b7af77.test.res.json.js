
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.json(object)', function(){
it('should not support jsonp callbacks', function(done){
var app = express();

app.use(function(req, res){
res.json({ foo: 'bar' });
});

request(app)
.get('/?callback=foo')
.expect('{"foo":"bar"}', done);
