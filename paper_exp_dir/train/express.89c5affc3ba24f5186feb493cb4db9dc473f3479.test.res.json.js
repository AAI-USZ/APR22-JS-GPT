
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
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('something({"count":1});');
done();
})
})

it('should allow renaming callback', function(done){
var app = express();

app.enable('jsonp callback');
app.set('jsonp callback name', 'clb');

app.use(function(req, res){
res.json({ count: 1 });
});

request(app)
.get('/?clb=something')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('something({"count":1});');
done();
})
})

it('should allow []', function(done){
var app = express();

app.enable('jsonp callback');
app.use(function(req, res){
res.json({ count: 1 });
});

request(app)
.get('/?callback=callbacks[123]')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('callbacks[123]({"count":1});');
done();
})
})

it('should disallow arbitrary js', function(done){
var app = express();

app.enable('jsonp callback');
app.use(function(req, res){
res.json({});
});

request(app)
