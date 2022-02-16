
var express = require('../')
, Router = express.Router
, methods = require('methods')
, assert = require('assert');

describe('Router', function(){

it('should return a function with router methods', function() {
var router = Router();
assert(typeof router == 'function');

var router = new Router();
assert(typeof router == 'function');

assert(typeof router.get == 'function');
assert(typeof router.handle == 'function');
assert(typeof router.use == 'function');
});

it('should support .use of other routers', function(done) {
var router = Router();
var another = Router();

another.get('/bar', function(req, res) {
res.done();
});
router.use('/foo', another);

router.handle({ url: '/foo/bar', method: 'GET' }, { done: done });
});

it('should support dynamic routes', function(done){
var router = new Router();
var another = new Router();

another.get('/:bar', function(req, res){
req.params.foo.should.equal('test');
req.params.bar.should.equal('route');
res.end();
});
router.use('/:foo', another);

