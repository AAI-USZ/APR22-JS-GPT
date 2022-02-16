'use strict';

var should = require('chai').should();
var sinon = require('sinon');

describe('Locals', function() {
var Locals = require('../../../lib/hexo/locals');
var locals = new Locals();

it('get() - name must be a string', function() {
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', 'name must be a string!');
});

try {
locals.get();
} catch (err) {
errorCallback(err);
}

errorCallback.calledOnce.should.be.true;
});

it('set() - function', function() {
locals.set('foo', function() {
return 'foo';
});


should.not.exist(locals.cache.foo);
locals.get('foo').should.eql('foo');

locals.cache.foo.should.eql('foo');
});

it('set() - not function', function() {
locals.set('foo', 'foo');
locals.get('foo').should.eql('foo');
});

it('set() - name must be a string', function() {
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', 'name must be a string!');
});

try {
locals.set();
} catch (err) {
errorCallback(err);
}

errorCallback.calledOnce.should.be.true;
});

it('set() - value is required', function() {
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', 'value is required!');
});

try {
locals.set('test');
} catch (err) {
