'use strict';

var should = require('chai').should();

describe('Generator', function() {
var Generator = require('../../../lib/extend/generator');

it('register()', function() {
var g = new Generator();


g.register('test', function() {});

g.get('test').should.exist;


g.register(function() {});

g.get('generator-0').should.exist;


