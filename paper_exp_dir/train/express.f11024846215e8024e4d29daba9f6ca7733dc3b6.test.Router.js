
var express = require('../')
, Router = express.Router
, request = require('./support/http')
, assert = require('assert');

describe('Router', function(){
var router, app;

beforeEach(function(){
router = new Router;
app = express();
})

describe('.match(method, url, i)', function(){
it('should match based on index', function(){
router.route('get', '/foo', function(){});
router.route('get', '/foob?', function(){});
router.route('get', '/bar', function(){});
var method = 'GET'
, url = '/foo?bar=baz';

var route = router.match(method, url, 0);
route.constructor.name.should.equal('Route');
route.method.should.equal('get');
route.path.should.equal('/foo');

var route = router.matchRe(method, url, 1);
