
var assert = require('assert')
var express = require('..')
var request = require('supertest')

describe('app', function(){
it('should inherit from event emitter', function(done){
var app = express();
app.on('foo', done);
app.emit('foo');
})

it('should be callable', function(){
var app = express();
assert(typeof app, 'function');
})

it('should 404 without routes', function(done){
request(express())
.get('/')
.expect(404, done);
})
})

describe('app.parent', function(){
it('should return the parent when mounted', function(){
var app = express()
, blog = express()
, blogAdmin = express();

app.use('/blog', blog);
blog.use('/admin', blogAdmin);

assert(!app.parent, 'app.parent');
blog.parent.should.equal(app);
blogAdmin.parent.should.equal(blog);
})
})

describe('app.mountpath', function(){
it('should return the mounted path', function(){
var admin = express();
var app = express();
var blog = express();
var fallback = express();

app.use('/blog', blog);
app.use(fallback);
blog.use('/admin', admin);

admin.mountpath.should.equal('/admin');
