
var express = require('../')
, request = require('supertest')
, utils = require('connect').utils
, cookie = require('cookie');

describe('res', function(){
describe('.cookie(name, object)', function(){
it('should generate a JSON cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('user', { name: 'tobi' }).end();
});

request(app)
.get('/')
.end(function(err, res){
var val = ['user=' + encodeURIComponent('j:{"name":"tobi"}') + '; Path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})
})

describe('.cookie(name, string)', function(){
it('should set a cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi').end();
});

request(app)
.get('/')
.end(function(err, res){
var val = ['name=tobi; Path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})

it('should allow multiple calls', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi');
res.cookie('age', 1);
res.end();
});

request(app)
.get('/')
.end(function(err, res){
var val = ['name=tobi; Path=/', 'age=1; Path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})
})

describe('.cookie(name, string, options)', function(){
it('should set params', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi', { httpOnly: true, secure: true });
res.end();
});

request(app)
.get('/')
.end(function(err, res){
var val = ['name=tobi; Path=/; HttpOnly; Secure'];
res.headers['set-cookie'].should.eql(val);
done();
})
})

describe('maxAge', function(){
it('should set relative expires', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi', { maxAge: 1000 });
res.end();
});

request(app)
.get('/')
.end(function(err, res){
done();
})
})

it('should set max-age', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi', { maxAge: 1000 });
res.end();
});

request(app)
.get('/')
