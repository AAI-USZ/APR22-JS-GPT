
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

it('should handle blank URL', function(done){
var router = new Router();

router.use(function (req, res) {
false.should.be.true;
});

router.handle({ url: '', method: 'GET' }, {}, done);
});

it('should not stack overflow with many registered routes', function(done){
var handler = function(req, res){ res.end(new Error('wrong handler')) };
var router = new Router();

for (var i = 0; i < 6000; i++) {
router.get('/thing' + i, handler)
}

router.get('/', function (req, res) {
res.end();
});

router.handle({ url: '/', method: 'GET' }, { end: done });
