var should = require('chai').should();

describe('Helper', () => {
var Helper = require('../../../lib/extend/helper');

it('register()', () => {
var h = new Helper();


h.register('test', () => {});

h.get('test').should.exist;
