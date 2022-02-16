
var express = require('../')
, assert = require('assert');

describe('config', function(){
describe('.set()', function(){
it('should set a value', function(){
var app = express();
app.set('foo', 'bar').should.equal(app);
})
})

describe('.get()', function(){
it('should return undefined when unset', function(){
var app = express();
assert(undefined === app.get('foo'));
})

it('should otherwise return the value', function(){
var app = express();
app.set('foo', 'bar');
app.get('foo').should.equal('bar');
})

describe('when mounted', function(){
it('should default to the parent app', function(){
var app = express()
, blog = express();

app.set('title', 'Express');
app.use(blog);
blog.get('title').should.equal('Express');
})
