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
