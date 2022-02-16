
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

describe('when relative', function(){
it('should construct an absolute url', function(done){
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

describe('when mounted', function(){
it('should respect the mount-point', function(done){
var app = express()
, admin = express();

admin.use(function(req, res){
res.redirect('/admin/login');
});

app.use('/blog', admin);

request(app)
.get('/blog')
.set('Host', 'example.com')
.end(function(res){
res.headers.should.have.property('location', 'http://example.com/blog/admin/login');
done();
})
})
})

describe('when deeply mounted', function(){

it('should respect the mount-point');
})
})

describe('.redirect(status, url)', function(){
it('should set the response status', function(done){
var app = express();
