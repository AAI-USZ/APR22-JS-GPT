'use strict';

var should = require('chai').should();

describe('Helper', function() {
var Helper = require('../../../lib/extend/helper');

it('register()', function() {
var h = new Helper();


h.register('test', function() {});

h.get('test').should.exist;


try {
h.register('test');
} catch (err) {
err.should.be
