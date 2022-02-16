
var express = require('../')
, request = require('supertest');

describe('res', function(){
describe('.redirect(url)', function(){
it('should default to a 302 redirect', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com');
});

request(app)
.get('/')
.expect('location', 'http://google.com')
.expect(302, done)
})
})

describe('.redirect(status, url)', function(){
it('should set the response status', function(done){
var app = express();

app.use(function(req, res){
res.redirect(303, 'http://google.com');
});

request(app)
.get('/')
.end(function(err, res){
res.statusCode.should.equal(303);
res.headers.should.have.property('location', 'http://google.com');
done();
})
})
})

describe('.redirect(url, status)', function(){
it('should set the response status', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com', 303);
});

request(app)
.get('/')
.end(function(err, res){
res.statusCode.should.equal(303);
res.headers.should.have.property('location', 'http://google.com');
done();
})
})
})

describe('when the request method is HEAD', function(){
it('should ignore the body', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com');
});

request(app)
.head('/')
.end(function(err, res){
res.headers.should.have.property('location', 'http://google.com');
res.text.should.equal('');
done();
})
})
})

describe('when accepting html', function(){
it('should respond with html', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com');
});

request(app)
.get('/')
.set('Accept', 'text/html')
.end(function(err, res){
res.headers.should.have.property('location', 'http://google.com');
res.text.should.equal('<p>Moved Temporarily. Redirecting to <a href="http://google.com">http://google.com</a></p>');
done();
})
})

it('should escape the url', function(done){
var app = express();

app.use(function(req, res){
res.redirect('<lame>');
});

request(app)
.get('/')
.set('Host', 'http://example.com')
.set('Accept', 'text/html')
.end(function(err, res){
res.text.should.equal('<p>Moved Temporarily. Redirecting to <a href="&lt;lame&gt;">&lt;lame&gt;</a></p>');
done();
})
})

it('should include the redirect type', function(done){
var app = express();

app.use(function(req, res){
res.redirect(301, 'http://google.com');
});

request(app)
