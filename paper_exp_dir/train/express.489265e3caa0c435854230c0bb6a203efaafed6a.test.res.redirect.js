
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.redirect(url)', function(){
it('should default to a 302 redirect', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com');
});

request(app)
.get('/')
.end(function(res){
res.statusCode.should.equal(302);
res.headers.should.have.property('location', 'http://google.com');
done();
})
})

describe('with leading /', function(){
it('should construct host-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.redirect('/login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.end(function(res){
res.headers.should.have.property('location', 'http://example.com/login');
done();
})
})
})

describe('with leading ./', function(){
it('should construct path-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.redirect('./edit');
});

request(app)
.get('/post/1')
.set('Host', 'example.com')
.end(function(res){
res.headers.should.have.property('location', 'http://example.com/post/1/edit');
done();
})
})
})

describe('without leading /', function(){
it('should construct mount-point relative urls', function(done){
var app = express();

app.use(function(req, res){
