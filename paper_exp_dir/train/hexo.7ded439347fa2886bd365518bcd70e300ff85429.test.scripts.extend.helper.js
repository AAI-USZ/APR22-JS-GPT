'use strict';

require('chai').should();

describe('Helper', () => {
const Helper = require('../../../lib/extend/helper');

it('register()', () => {
const h = new Helper();


h.register('test', () => {});
