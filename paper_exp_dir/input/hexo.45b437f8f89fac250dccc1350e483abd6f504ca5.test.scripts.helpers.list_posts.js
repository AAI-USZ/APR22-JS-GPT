'use strict';

describe('list_posts', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const listPosts = require('../../../lib/plugins/helper/list_posts').bind(ctx);

hexo.config.permalink = ':title/';

