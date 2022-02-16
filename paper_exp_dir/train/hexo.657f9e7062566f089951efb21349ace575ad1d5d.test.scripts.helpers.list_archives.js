'use strict';

var should = require('chai').should();

describe('list_archives', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');

var ctx = {
config: hexo.config,
page: {}
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listArchives = require('../../../lib/plugins/helper/list_archives').bind(ctx);

function resetLocals() {
hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
}

before(function() {
return hexo.init().then(function() {
return Post.insert([
{source: 'foo', slug: 'foo', date: new Date(2014, 1, 2)},
{source: 'bar', slug: 'bar', date: new Date(2013, 5, 6)},
{source: 'baz', slug: 'baz', date: new Date(2013, 9, 10)},
{source: 'boo', slug: 'boo', date: new Date(2013, 5, 8)}
]);
}).then(function() {
resetLocals();
});
