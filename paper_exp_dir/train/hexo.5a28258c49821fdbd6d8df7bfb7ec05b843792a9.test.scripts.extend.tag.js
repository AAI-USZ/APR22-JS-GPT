var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Tag', () => {
var Tag = require('../../../lib/extend/tag');
var tag = new Tag();

it('register()', () => {
var tag = new Tag();

tag.register('test', (args, content) => args.join(' '));

return tag.render('{% test foo.bar | abcdef > fn(a, b, c) < fn() %}').then(result => {
result.should.eql('foo.bar | abcdef > fn(a, b, c) < fn()');
});
});

it('register() - async', () => {
var tag = new Tag();

tag.register('test', (args, content) => Promise.resolve(args.join(' ')), {async: true});

return tag.render('{% test foo bar %}').then(result => {
result.should.eql('foo bar');
});
});

it('register() - block', () => {
var tag = new Tag();

tag.register('test', (args, content) => args.join(' ') + ' ' + content, true);

var str = [
'{% test foo bar %}',
'test content',
'{% endtest %}'
].join('\n');

return tag.render(str).then(result => {
result.should.eql('foo bar test content');
});
});

it('register() - async block', () => {
var tag = new Tag();

tag.register('test', (args, content) => Promise.resolve(args.join(' ') + ' ' + content), {ends: true, async: true});

var str = [
'{% test foo bar %}',
'test content',
'{% endtest %}'
].join('\n');

return tag.render(str).then(result => {
result.should.eql('foo bar test content');
});
});

it('register() - nested test', () => {
var tag = new Tag();

tag.register('test', (args, content) => content, true);

var str = [
'{% test %}',
'123456',
'  {% raw %}',
'  raw',
'  {% endraw %}',
'  {% test %}',
'  test',
'  {% endtest %}',
'789012',
'{% endtest %}'
].join('\n');

return tag.render(str).then(result => {
result.replace(/\s/g, '').should.eql('123456rawtest789012');
});
});

it('register() - nested async / async test', () => {
var tag = new Tag();

tag.register('test', (args, content) => content, {ends: true, async: true});
tag.register('async', (args, content) => {
return Promise.resolve(args.join(' ') + ' ' + content);
}, {ends: true, async: true});

var str = [
'{% test %}',
'123456',
'  {% async %}',
