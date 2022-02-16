'use strict';

describe('Console', () => {
const Console = require('../../../lib/extend/console');

it('register()', () => {
const c = new Console();


should.throw(() => c.register(), TypeError, 'name is required');


c.register('test', () => {});

c.get('test').should.exist;


should.throw(() => c.register('test'), TypeError, 'fn must be a function');


c.register('test', 'this is a test', () => {});
