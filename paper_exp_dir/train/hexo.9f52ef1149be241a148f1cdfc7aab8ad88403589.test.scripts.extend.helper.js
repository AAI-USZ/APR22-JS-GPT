'use strict';

describe('Helper', () => {
const Helper = require('../../../lib/extend/helper');

it('register()', () => {
const h = new Helper();


h.register('test', () => {});

h.get('test').should.exist;


