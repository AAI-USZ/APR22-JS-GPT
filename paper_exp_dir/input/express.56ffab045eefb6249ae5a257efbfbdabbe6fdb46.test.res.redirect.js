
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
.end(function(err, res){
res.statusCode.should.equal(302);
res.headers.should.have.property('location', 'http://google.com');
done();
})
})

describe('with leading //', function(){
it('should pass through scheme-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.redirect('//cuteoverload.com');
});

request(app)
.get('/')
.set('Host', 'example.com')
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
res.redirect('/login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/login');
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
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/post/1/./edit');
done();
})
})
})

describe('with leading ../', function(){
it('should construct path-relative urls', function(done){
var app = express();

app.use(function(req, res){
res.redirect('../new');
});

request(app)
.get('/post/1')
.set('Host', 'example.com')
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/post/1/../new');
done();
})
})
})

describe('without leading /', function(){
it('should construct mount-point relative urls', function(done){
var app = express();

app.use(function(req, res){
res.redirect('login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/login');
done();
})
})
})

describe('when mounted', function(){
describe('deeply', function(){
it('should respect the mount-point', function(done){
var app = express()
, blog = express()
, admin = express();

admin.use(function(req, res){
res.redirect('login');
});

app.use('/blog', blog);
blog.use('/admin', admin);

request(app)
.get('/blog/admin')
.set('Host', 'example.com')
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/blog/admin/login');
done();
})
})
})

describe('omitting leading /', function(){
it('should respect the mount-point', function(done){
var app = express()
, admin = express();

admin.use(function(req, res){
res.redirect('admin/login');
});

app.use('/blog', admin);

request(app)
.get('/blog')
.set('Host', 'example.com')
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/blog/admin/login');
done();
})
})
})

describe('providing leading /', function(){
it('should ignore mount-point', function(done){
var app = express()
, admin = express();

admin.use(function(req, res){
res.redirect('/admin/login');
});

app.use('/blog', admin);

request(app)
.get('/blog')
.set('Host', 'example.com')
.end(function(err, res){
res.headers.should.have.property('location', '//example.com/admin/login');
done();
})
})
})
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

var app = express();

app.use(function(req, res){
