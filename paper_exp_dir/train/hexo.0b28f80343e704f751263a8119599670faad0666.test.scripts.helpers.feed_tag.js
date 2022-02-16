'use strict';

describe('feed_tag', () => {
const ctx = {
config: {
title: 'Hexo',
url: 'http://yoursite.com',
root: '/',
feed: {}
}
};

beforeEach(() => { ctx.config.feed = {}; });

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const feed = require('../../../lib/plugins/helper/feed_tag').bind(ctx);

it('path - atom', () => {
feed('atom.xml').should.eql('<link rel="alternate" href="/atom.xml" title="Hexo" type="application/atom+xml">');
});

it('path - rss', () => {
feed('rss2.xml').should.eql('<link rel="alternate" href="/rss2.xml" title="Hexo" type="application/rss+xml">');
});

it('title', () => {
feed('atom.xml', {title: 'RSS Feed'}).should.eql('<link rel="alternate" href="/atom.xml" title="RSS Feed" type="application/atom+xml">');
});

it('type', () => {
feed('rss.xml', {type: 'rss'}).should.eql('<link rel="alternate" href="/rss.xml" title="Hexo" type="application/rss+xml">');
});

it('type - null', () => {
feed('foo.xml', {type: null}).should.eql('<link rel="alternate" href="/foo.xml" title="Hexo" >');
});

it('invalid input - number', () => {
