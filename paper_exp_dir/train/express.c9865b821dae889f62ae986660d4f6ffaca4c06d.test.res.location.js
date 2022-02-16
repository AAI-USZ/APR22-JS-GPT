
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.location(url)', function(){
it('should set the header', function(done){
var app = express();

app.use(function(req, res){
res.location('http://google.com').end();
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('location', 'http://google.com');
done();
})
})

describe('with leading //', function(){
it('should pass through scheme-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.location('//cuteoverload.com').end();
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('location', '//cuteoverload.com');
done();
})
})
})

describe('with leading /', function(){
it('should construct scheme-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.location('/login').end();
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('location', '/login');
done();
})
})
})

describe('with leading ./', function(){
it('should construct path-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.location('./edit').end();
});

request(app)
.get('/post/1')
.end(function(err, res){
res.headers.should.have.property('location', '/post/1/edit');
done();
})
})
})

describe('with leading ../', function(){
it('should construct path-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.location('../new').end();
});

request(app)
.get('/post/1')
.end(function(err, res){
res.headers.should.have.property('location', '/post/new');
done();
})
})
})

describe('with leading ./ and containing ..', function(){
it('should construct path-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.location('./skip/../../new').end();
});

request(app)
.get('/post/1')
.end(function(err, res){
res.headers.should.have.property('location', '/post/new');
done();
})
})
})

describe('without leading /', function(){
it('should construct mount-point relative urls', function(done){
var app = express();

app.use(function(req, res){
