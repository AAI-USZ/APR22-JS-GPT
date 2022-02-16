var should = require('chai').should();
var Promise = require('bluebird');

describe('list_categories', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Category = hexo.model('Category');

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listCategories = require('../../../lib/plugins/helper/list_categories').bind(ctx);

before(() => hexo.init().then(() => Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'},
{source: 'bat', slug: 'bat'}
])).then(posts => Promise.each([
['baz'],
['baz', 'bar'],
['foo'],
['baz'],
['bat', ['baz', 'bar']]
], (cats, i) => posts[i].setCategories(cats))).then(() => {
hexo.locals.invalidate();
