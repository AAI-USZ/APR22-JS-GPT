'use strict';

describe('Processor', () => {
const Processor = require('../../../lib/extend/processor');

it('register()', () => {
const p = new Processor();


p.register('test', () => {});

p.list()[0].should.exist;


