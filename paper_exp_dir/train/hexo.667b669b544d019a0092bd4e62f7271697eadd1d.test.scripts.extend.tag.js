'use strict';

const sinon = require('sinon');
const Promise = require('bluebird');

describe('Tag', () => {
const Tag = require('../../../lib/extend/tag');
const tag = new Tag();

it('register()', async () => {
const tag = new Tag();

tag.register('test', (args, content) => args.join(' '));

const result = await tag.render('{% test foo.bar | abcdef > fn(a, b, c) < fn() %}');
result.should.eql('foo.bar | abcdef > fn(a, b, c) < fn()');
});

it('register() - async', async () => {
const tag = new Tag();

tag.register('test', (args, content) => Promise.resolve(args.join(' ')), { async: true });

const result = await tag.render('{% test foo bar %}');
result.should.eql('foo bar');
