
var after = require('after');
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

it('should support .use of other routers', function(done){
var router = new Router();
var another = new Router();

another.get('/bar', function(req, res){
res.end();
});
router.use('/foo', another);

router.handle({ url: '/foo/bar', method: 'GET' }, { end: done });
});

it('should support dynamic routes', function(done){
var router = new Router();
var another = new Router();

another.get('/:bar', function(req, res){
req.params.bar.should.equal('route');
res.end();
});
router.use('/:foo', another);

router.handle({ url: '/test/route', method: 'GET' }, { end: done });
});

describe('.handle', function(){
it('should dispatch', function(done){
var router = new Router();

router.route('/foo').get(function(req, res){
res.send('foo');
});

var res = {
send: function(val) {
val.should.equal('foo');
done();
}
}
router.handle({ url: '/foo', method: 'GET' }, res);
})
})

describe('.multiple callbacks', function(){
it('should throw if a callback is null', function(){
assert.throws(function () {
var router = new Router();
router.route('/foo').all(null);
})
})

it('should throw if a callback is undefined', function(){
assert.throws(function () {
var router = new Router();
router.route('/foo').all(undefined);
})
})

it('should throw if a callback is not a function', function(){
assert.throws(function () {
var router = new Router();
router.route('/foo').all('not a function');
})
})

it('should not throw if all callbacks are functions', function(){
var router = new Router();
router.route('/foo').all(function(){}).all(function(){});
})
})

describe('error', function(){
it('should skip non error middleware', function(done){
var router = new Router();

router.get('/foo', function(req, res, next){
next(new Error('foo'));
});

router.get('/bar', function(req, res, next){
next(new Error('bar'));
});

router.use(function(req, res, next){
assert(false);
});

router.use(function(err, req, res, next){
assert.equal(err.message, 'foo');
done();
});

router.handle({ url: '/foo', method: 'GET' }, {}, done);
});

it('should handle throwing inside routes with params', function(done) {
var router = new Router();

router.get('/foo/:id', function(req, res, next){
throw new Error('foo');
});

router.use(function(req, res, next){
assert(false);
});

router.use(function(err, req, res, next){
assert.equal(err.message, 'foo');
done();
});

router.handle({ url: '/foo/2', method: 'GET' }, {}, function() {});
});

it('should handle throwing in handler after async param', function(done) {
var router = new Router();

router.param('user', function(req, res, next, val){
process.nextTick(function(){
req.user = val;
next();
});
});

router.use('/:user', function(req, res, next){
