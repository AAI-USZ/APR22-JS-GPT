var should = require('chai').should();

describe('Renderer', () => {
var Renderer = require('../../../lib/extend/renderer');

it('register()', () => {
var r = new Renderer();


r.register('yaml', 'json', () => {});

r.get('yaml').should.exist;
