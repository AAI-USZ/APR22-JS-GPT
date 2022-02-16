
var express = require('../')
, assert = require('assert');

describe('app', function(){
it('should inherit from event emitter', function(done){
var app = express();
app.on('foo', done);
app.emit('foo');
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
var app = express()
, blog = express()
, blogAdmin = express();

app.use('/blog', blog);
blog.use('/admin', blogAdmin);

app.mountpath.should.equal('/');
blog.mountpath.should.equal('/blog');
blogAdmin.mountpath.should.equal('/admin');
})
})

describe('app.router', function(){
it('should throw with notice', function(done){
var app = express()

try {
app.router;
} catch(err) {
