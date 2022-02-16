
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.deprecate(fn, msg)', function(){
var env
before(function(){
env = process.env.NODE_ENV
})
after(function(){
process.env.NODE_ENV = env
})

it('should pass-through fn in test environment', function(){
var fn = function(){}
