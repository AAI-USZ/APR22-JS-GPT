const should = require('chai').should();

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

before(() => hexo.init().then(() => Post.insert([
{source: 'foo', slug: 'foo', date: new Date(2014, 1, 2)},
{source: 'bar', slug: 'bar', date: new Date(2013, 5, 6)},
{source: 'baz', slug: 'baz', date: new Date(2013, 9, 10)},
{source: 'boo', slug: 'boo', date: new Date(2013, 5, 8)}
])).then(() => {
resetLocals();
}));

it('default', () => {
const result = listArchives();

result.should.eql([
'<ul class="archive-list">',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2014/02/">February 2014</a><span class="archive-list-count">1</span></li>',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2013/10/">October 2013</a><span class="archive-list-count">1</span></li>',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2013/06/">June 2013</a><span class="archive-list-count">2</span></li>',
'</ul>'
].join(''));
});

it('type: yearly', () => {
const result = listArchives({
type: 'yearly'
});

result.should.eql([
'<ul class="archive-list">',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2014/">2014</a><span class="archive-list-count">1</span></li>',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2013/">2013</a><span class="archive-list-count">3</span></li>',
'</ul>'
].join(''));
});

it('format', () => {
const result = listArchives({
format: 'YYYY/M'
});

result.should.eql([
'<ul class="archive-list">',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2014/02/">2014/2</a><span class="archive-list-count">1</span></li>',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2013/10/">2013/10</a><span class="archive-list-count">1</span></li>',
'<li class="archive-list-item"><a class="archive-list-link" href="/archives/2013/06/">2013/6</a><span class="archive-list-count">2</span></li>',
'</ul>'
].join(''));
});

it('style: false', () => {
const result = listArchives({
