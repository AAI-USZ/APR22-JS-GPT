
var after = require('after');
var express = require('..');
var request = require('supertest');

describe('app', function(){
it('should emit "mount" when mounted', function(done){
var blog = express()
, app = express();

blog.on('mount', function(arg){
arg.should.equal(app);
done();
});

app.use(blog);
})

it('should reject missing functions', function(){
var app = express();
app.use.bind(app, 3).should.throw(/requires middleware function/);
})

describe('.use(app)', function(){
it('should mount the app', function(done){
var blog = express()
, app = express();

blog.get('/blog', function(req, res){
res.end('blog');
});

app.use(blog);

request(app)
.get('/blog')
.expect('blog', done);
})

it('should support mount-points', function(done){
var blog = express()
, forum = express()
, app = express();

blog.get('/', function(req, res){
res.end('blog');
});

forum.get('/', function(req, res){
res.end('forum');
});

app.use('/blog', blog);
app.use('/forum', forum);

request(app)
.get('/blog')
.expect('blog', function(){
request(app)
.get('/forum')
.expect('forum', done);
});
})

it('should set the child\'s .parent', function(){
var blog = express()
, app = express();

app.use('/blog', blog);
blog.parent.should.equal(app);
})

it('should support dynamic routes', function(done){
var blog = express()
, app = express();

blog.get('/', function(req, res){
res.end('success');
});

app.use('/post/:article', blog);

request(app)
.get('/post/once-upon-a-time')
.expect('success', done);
})

it('should support mounted app anywhere', function(done){
var cb = after(3, done);
var blog = express()
, other = express()
, app = express();

function fn1(req, res, next) {
res.setHeader('x-fn-1', 'hit');
next();
}

function fn2(req, res, next) {
res.setHeader('x-fn-2', 'hit');
next();
}

blog.get('/', function(req, res){
res.end('success');
});

blog.once('mount', function (parent) {
parent.should.equal(app);
cb();
});
other.once('mount', function (parent) {
parent.should.equal(app);
cb();
});

app.use('/post/:article', fn1, other, fn2, blog);

request(app)
.get('/post/once-upon-a-time')
.expect('x-fn-1', 'hit')
.expect('x-fn-2', 'hit')
.expect('success', cb);
})
})

describe('.use(middleware)', function(){
it('should accept multiple arguments', function (done) {
var app = express();

function fn1(req, res, next) {
res.setHeader('x-fn-1', 'hit');
next();
}

function fn2(req, res, next) {
res.setHeader('x-fn-2', 'hit');
next();
}

app.use(fn1, fn2, function fn3(req, res) {
res.setHeader('x-fn-3', 'hit');
res.end();
});

request(app)
.get('/')
.expect('x-fn-1', 'hit')
.expect('x-fn-2', 'hit')
.expect('x-fn-3', 'hit')
.expect(200, done);
})

it('should invoke middleware for all requests', function (done) {
var app = express();
var cb = after(3, done);

app.use(function (req, res) {
res.send('saw ' + req.method + ' ' + req.url);
});

request(app)
.get('/')
.expect(200, 'saw GET /', cb);

request(app)
.options('/')
.expect(200, 'saw OPTIONS /', cb);

request(app)
.post('/foo')
.expect(200, 'saw POST /foo', cb);
})
