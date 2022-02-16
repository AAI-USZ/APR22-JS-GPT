
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.json(object)', function(){
describe('when "jsonp callback" is enabled', function(){
it('should respond with jsonp', function(done){
var app = express();

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

it('should allow []', function(done){
var app = express();

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
})

describe('when given primitives', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json(null);
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('null');
done();
})
})
})

describe('when given an array', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json(['foo', 'bar', 'baz']);
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('["foo","bar","baz"]');
done();
})
})
})

describe('when given an object', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json({ name: 'tobi' });
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('{"name":"tobi"}');
