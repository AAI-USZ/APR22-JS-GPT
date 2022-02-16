
var express = require('../')
, request = require('./support/http');

describe('app.router', function(){
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

describe('when "case sensitive routes" is enabled', function(){
it('should match identical casing', function(done){
var app = express();

app.enable('case sensitive routes');

app.get('/uSer', function(req, res){
res.end('tj');
});

request(app)
.get('/uSer')
.expect('tj', done);
})

it('should not match otherwise', function(done){
var app = express();

app.enable('case sensitive routes');

app.get('/uSer', function(req, res){
res.end('tj');
});

request(app)
.get('/user')
.expect('Cannot GET /user', done);
})
})
})

describe('trailing slashes', function(){
it('should be optional by default', function(done){
var app = express();

app.get('/user', function(req, res){
res.end('tj');
});

request(app)
.get('/user/')
.expect('tj', done);
})

describe('when "strict routing" is enabled', function(){
it('should match trailing slashes', function(done){
var app = express();

app.enable('strict routing');

app.get('/user/', function(req, res){
res.end('tj');
});
