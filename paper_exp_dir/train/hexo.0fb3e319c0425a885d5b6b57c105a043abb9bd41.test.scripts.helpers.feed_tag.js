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

const feed = require('../../../lib/plugins/helper/feed_tag').bind(ctx);

it('path - atom', () => {
feed('atom.xml').should.eql('<link rel="alternate" href="/atom.xml" title="Hexo" type="application/atom+xml">');
});

it('path - rss', () => {
feed('rss2.xml').should.eql('<link rel="alternate" href="/rss2.xml" title="Hexo" type="application/rss+xml">');
});

it('title', () => {
