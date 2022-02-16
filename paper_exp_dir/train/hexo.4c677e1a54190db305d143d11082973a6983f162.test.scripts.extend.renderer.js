'use strict';

describe('Renderer', () => {
const Renderer = require('../../../lib/extend/renderer');

it('register()', () => {
const r = new Renderer();


r.register('yaml', 'json', () => {});

r.get('yaml').should.exist;
r.get('yaml').output.should.eql('json');


r.register('yaml', 'json', () => {}, true);

r.get('yaml').should.exist;
r.get('yaml').output.should.eql('json');
r.get('yaml', true).should.exist;
r.get('yaml', true).output.should.eql('json');


should.throw(() => r.register('yaml', 'json'), TypeError, 'fn must be a function');


should.throw(() => r.register('yaml'), TypeError, 'output is required');


should.throw(() => r.register(), TypeError, 'name is required');
});

it('register() - promisify', async () => {
const r = new Renderer();
