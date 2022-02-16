'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Tag', function() {
var Tag = require('../../../lib/extend/tag');
var tag = new Tag();

it('register()', function() {
var tag = new Tag();

tag.register('test', function(args, content) {
return args.join(' ');
});

return tag.render('{% test foo.bar | abcdef > fn(a, b, c) < fn() %}').then(function(result) {
result.should.eql('foo.bar | abcdef > fn(a, b, c) < fn()');
});
});

it('register() - async', function() {
var tag = new Tag();

tag.register('test', function(args, content) {
return Promise.resolve(args.join(' '));
}, {async: true});

return tag.render('{% test foo bar %}').then(function(result) {
result.should.eql('foo bar');
});
});

it('register() - block', function() {
var tag = new Tag();

tag.register('test', function(args, content) {
return args.join(' ') + ' ' + content;
}, true);

var str = [
'{% test foo bar %}',
'test content',
'{% endtest %}'
].join('\n');

return tag.render(str).then(function(result) {
