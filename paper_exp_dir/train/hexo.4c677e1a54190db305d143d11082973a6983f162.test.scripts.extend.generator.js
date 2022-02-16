'use strict';

describe('Generator', () => {
const Generator = require('../../../lib/extend/generator');

it('register()', () => {
const g = new Generator();


g.register('test', () => {});

g.get('test').should.exist;


g.register(() => {});

g.get('generator-0').should.exist;


should.throw(() => g.register('test'), TypeError, 'fn must be a function');
});

it('register() - promisify', async () => {
const g = new Generator();

g.register('test', (locals, render, callback) => {
callback(null, 'foo');
});

