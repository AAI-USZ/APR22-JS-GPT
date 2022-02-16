const should = require('chai').should();
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Tag', () => {
const Tag = require('../../../lib/extend/tag');
const tag = new Tag();

it('register()', () => {
const tag = new Tag();

tag.register('test', (args, content) => args.join(' '));

return tag.render('{% test foo.bar | abcdef > fn(a, b, c) < fn() %}').then(result => {
result.should.eql('foo.bar | abcdef > fn(a, b, c) < fn()');
});
});

it('register() - async', () => {
const tag = new Tag();

tag.register('test', (args, content) => Promise.resolve(args.join(' ')), {async: true});

return tag.render('{% test foo bar %}').then(result => {
result.should.eql('foo bar');
});
});

it('register() - block', () => {
const tag = new Tag();

tag.register('test', (args, content) => args.join(' ') + ' ' + content, true);

const str = [
'{% test foo bar %}',
'test content',
'{% endtest %}'
].join('\n');

return tag.render(str).then(result => {
result.should.eql('foo bar test content');
});
});

it('register() - async block', () => {
const tag = new Tag();
