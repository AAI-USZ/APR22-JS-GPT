'use strict';

describe('list_archives', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const ctx = {
config: hexo.config,
page: {}
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const listArchives = require('../../../lib/plugins/helper/list_archives').bind(ctx);

function resetLocals() {
hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
}

before(async () => {
await hexo.init();
await Post.insert([
{source: 'foo', slug: 'foo', date: new Date(2014, 1, 2)},
{source: 'bar', slug: 'bar', date: new Date(2013, 5, 6)},
{source: 'baz', slug: 'baz', date: new Date(2013, 9, 10)},
{source: 'boo', slug: 'boo', date: new Date(2013, 5, 8)}
]);
resetLocals();
});
