
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

it('should reject numbers', function(){
var app = express();
app.use.bind(app, 3).should.throw(/Number/);
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
})

describe('.use(middleware)', function(){
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
})

describe('.use(path, middleware)', function(){
it('should strip path from req.url', function (done) {
var app = express();

app.use('/foo', function (req, res) {
res.send('saw ' + req.method + ' ' + req.url);
});

request(app)
.get('/foo/bar')
.expect(200, 'saw GET /bar', done);
})

it('should invoke middleware for all requests starting with path', function (done) {
var app = express();
var cb = after(3, done);

app.use('/foo', function (req, res) {
res.send('saw ' + req.method + ' ' + req.url);
});

request(app)
.get('/')
.expect(404, cb);

request(app)
.post('/foo')
.expect(200, 'saw POST /', cb);

request(app)
.post('/foo/bar')
.expect(200, 'saw POST /bar', cb);
})

it('should work if path has trailing slash', function (done) {
var app = express();
var cb = after(3, done);

app.use('/foo/', function (req, res) {
res.send('saw ' + req.method + ' ' + req.url);
});

request(app)
.get('/')
.expect(404, cb);

request(app)
.post('/foo')
.expect(200, 'saw POST /', cb);

request(app)
.post('/foo/bar')
.expect(200, 'saw POST /bar', cb);
})

it('should support array of paths', function (done) {
