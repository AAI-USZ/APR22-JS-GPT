'use strict';

describe('Generator', () => {
const Generator = require('../../../lib/extend/generator');

it('register()', () => {
const g = new Generator();


g.register('test', () => {});

g.get('test').should.exist;


g.register(() => {});

g.get('generator-0').should.exist;


try {
g.register('test');
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}
});

it('register() - promisify', async () => {
const g = new Generator();

g.register('test', (locals, render, callback) => {
callback(null, 'foo');
});

const result = await g.get('test')({}, {});
result.should.eql('foo');
});

it('get()', () => {
const g = new Generator();

g.register('test', () => {});

g.get('test').should.exist;
});
