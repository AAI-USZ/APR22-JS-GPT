
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.jsonp(object)', function(){
it('should respond with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=something')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('something && something({"count":1});');
done();
})
})

it('should use first callback parameter with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=something&callback=somethingelse')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('something && something({"count":1});');
