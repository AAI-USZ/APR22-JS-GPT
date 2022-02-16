
var after = require('after');
var express = require('../')
, Router = express.Router
, methods = require('methods')
, assert = require('assert');

describe('Router', function(){
it('should return a function with router methods', function() {
var router = Router();
assert(typeof router == 'function');
