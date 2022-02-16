'use strict';

var should = require('chai').should();

describe('Console', function() {
var Console = require('../../../lib/extend/console');

it('register()', function() {
var c = new Console();


try {
c.register();
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'name is required');
}


c.register('test', function() {});

c.get('test').should.exist;


try {
c.register('test');
} catch (err) {
