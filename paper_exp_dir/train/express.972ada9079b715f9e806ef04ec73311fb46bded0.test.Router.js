
var after = require('after');
var express = require('../')
, Router = express.Router
, methods = require('methods')
, assert = require('assert');

describe('Router', function(){
it('should return a function with router methods', function() {
var router = new Router();
assert(typeof router == 'function');

assert(typeof router.get == 'function');
assert(typeof router.handle == 'function');
assert(typeof router.use == 'function');
});

it('should support .use of other routers', function(done){
var router = new Router();
var another = new Router();

