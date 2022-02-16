var should = require('chai').should();
var sinon = require('sinon');

describe('Filter', function(){
var Filter = require('../../../lib/extend/filter');

it('register()', function(){
var f = new Filter();


f.register('test', function(){});
f.list('test')[0].should.exist;
