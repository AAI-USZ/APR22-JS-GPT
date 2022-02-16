'use strict';

describe('Console', () => {
const Console = require('../../../lib/extend/console');

it('register()', () => {
const c = new Console();


try {
c.register();
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'name is required');
}


c.register('test', () => {});

c.get('test').should.exist;


try {
c.register('test');
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}


c.register('test', 'this is a test', () => {});

c.get('test').should.exist;
c.get('test').desc.should.eql('this is a test');


try {
c.register('test', 'this is a test');
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}


c.register('test', {init: true}, () => {});

c.get('test').should.exist;
c.get('test').options.init.should.be.true;


c.register('test', 'this is a test', {init: true}, () => {});

c.get('test').should.exist;
c.get('test').desc.should.eql('this is a test');
c.get('test').options.init.should.be.true;


