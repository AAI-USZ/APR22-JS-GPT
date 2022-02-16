
var express = require('../')
, request = require('./support/http')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
describe('methods supported', function(){
methods.forEach(function(method){
it('should include ' + method.toUpperCase(), function(done){
if (method == 'delete') method = 'del';
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
if ('head' == method) {
res.end();
} else {
res.end(method);
}
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
})
});
})

describe('decode querystring', function(){
it('should decode correct params', function(done){
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo%2Fbar')
.expect('foo/bar', done);
})

it('should not accept params in malformed paths', function(done) {
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/%foobar')
.expect(400, done);
})

it('should not decode spaces', function(done) {
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo+bar')
.expect('foo+bar', done);
})

it('should work with unicode', function(done) {
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/%ce%b1')
.expect('\u03b1', done);
})
})

it('should be .use()able', function(done){
var app = express();

var calls = [];

app.use(function(req, res, next){
calls.push('before');
next();
});

app.get('/', function(req, res, next){
calls.push('GET /')
next();
});

app.use(function(req, res, next){
calls.push('after');
res.end();
});

