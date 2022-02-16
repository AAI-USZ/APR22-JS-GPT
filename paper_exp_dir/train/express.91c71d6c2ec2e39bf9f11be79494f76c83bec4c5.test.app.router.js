
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

it('should decode params', function(done){
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo%2Fbar')
.expect('foo/bar', done);
})

it('should be .use()able', function(done){
var app = express();

var calls = [];

app.use(function(req, res, next){
calls.push('before');
next();
});

app.use(app.router);

app.use(function(req, res, next){
calls.push('after');
res.end();
});

app.get('/', function(req, res, next){
calls.push('GET /')
next();
});

request(app)
.get('/')
.end(function(res){
calls.should.eql(['before', 'GET /', 'after'])
done();
})
})

it('should be auto .use()d on the first app.VERB() call', function(done){
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

request(app)
.get('/')
.end(function(res){
calls.should.eql(['before', 'GET /', 'after'])
done();
})
})

describe('when given a regexp', function(){
it('should match the pathname only', function(done){
var app = express();

app.get(/^\/user\/[0-9]+$/, function(req, res){
res.end('user');
});

request(app)
.get('/user/12?foo=bar')
.expect('user', done);
})

it('should populate req.params with the captures', function(done){
var app = express();

app.get(/^\/user\/([0-9]+)\/(view|edit)?$/, function(req, res){
var id = req.params.shift()
, op = req.params.shift();
res.end(op + 'ing user ' + id);
});

request(app)
.get('/user/10/edit')
.expect('editing user 10', done);
})
})

describe('case sensitivity', function(){
it('should be disabled by default', function(done){
var app = express();

app.get('/user', function(req, res){
res.end('tj');
});

request(app)
.get('/USER')
.expect('tj', done);
})

describe('when "case sensitive routing" is enabled', function(){
it('should match identical casing', function(done){
