'use strict';

describe('Generator', () => {
const Generator = require('../../../lib/extend/generator');

it('register()', () => {
const g = new Generator();


g.register('test', () => {});

g.get('test').should.exist;


