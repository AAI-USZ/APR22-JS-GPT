'use strict';

var should = require('chai').should();

describe('Processor', function() {
var Processor = require('../../../lib/extend/processor');

it('register()', function() {
var p = new Processor();


p.register('test', function() {});

p.list()[0].should.exist;


p.register(function() {});
