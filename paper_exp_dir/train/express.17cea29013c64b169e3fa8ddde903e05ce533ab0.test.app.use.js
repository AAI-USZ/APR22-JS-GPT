
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
