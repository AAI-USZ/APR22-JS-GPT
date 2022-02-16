'use strict';

var should = require('chai').should();
var sinon = require('sinon');

describe('Filter', function() {
var Filter = require('../../../lib/extend/filter');

it('register()', function() {
var f = new Filter();


f.register('test', function() {});

f.list('test')[0].should.exist;
f.list('test')[0].priority.should.eql(10);


f.register('test2', function() {}, 50);

f.list('test2')[0].priority.should.eql(50);

