var should = require('chai').should();

describe('Processor', () => {
var Processor = require('../../../lib/extend/processor');

it('register()', () => {
var p = new Processor();


p.register('test', () => {});

p.list()[0].should.exist;
