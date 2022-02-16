
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
done();
})
})
})

describe('"json replacer" setting', function(){
it('should be passed to JSON.stringify()', function(done){
var app = express();

app.set('json replacer', function(key, val){
return '_' == key[0]
? undefined
: val;
});

app.use(function(req, res){
res.json({ name: 'tobi', _id: 12345 });
});

request(app)
.get('/')
.end(function(err, res){
res.text.should.equal('{"name":"tobi"}');
done();
});
})
})

describe('"json spaces" setting', function(){
it('should be undefined by default', function(){
var app = express();
assert(undefined === app.get('json spaces'));
})

it('should be passed to JSON.stringify()', function(done){
var app = express();

app.set('json spaces', 2);

