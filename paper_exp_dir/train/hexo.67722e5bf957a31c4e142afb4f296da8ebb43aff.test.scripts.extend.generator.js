var should = require('chai').should();

describe('Generator', () => {
var Generator = require('../../../lib/extend/generator');

it('register()', () => {
var g = new Generator();


g.register('test', () => {});

g.get('test').should.exist;
