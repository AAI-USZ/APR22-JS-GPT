'use strict';

var should = require('chai').should();
var assert = require('chai').assert;

describe('Locals', function(){
var Locals = require('../../../lib/hexo/locals');
var locals = new Locals();

it('get() - name must be a string', function(){
try {
locals.get();
assert.fail();
