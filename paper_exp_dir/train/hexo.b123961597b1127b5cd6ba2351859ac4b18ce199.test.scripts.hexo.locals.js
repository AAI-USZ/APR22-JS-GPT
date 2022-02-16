'use strict';

describe('Locals', () => {
const Locals = require('../../../lib/hexo/locals');
const locals = new Locals();

it('get() - name must be a string', () => {
should.throw(() => locals.get(), 'name must be a string!');
});

it('set() - function', () => {
locals.set('foo', () => 'foo');
