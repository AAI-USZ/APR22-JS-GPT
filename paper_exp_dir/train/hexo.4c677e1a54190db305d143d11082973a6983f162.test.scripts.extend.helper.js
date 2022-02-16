'use strict';

describe('Helper', () => {
const Helper = require('../../../lib/extend/helper');

it('register()', () => {
const h = new Helper();


h.register('test', () => {});

h.get('test').should.exist;


should.throw(() => h.register('test'), TypeError, 'fn must be a function');


should.throw(() => h.register(), TypeError, 'name is required');
});

it('list()', () => {
const h = new Helper();

h.register('test', () => {});

