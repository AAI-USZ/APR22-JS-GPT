'use strict';

const moment = require('moment');

describe('post_permalink', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const postPermalink = require('../../../lib/plugins/filter/post_permalink').bind(hexo);
const Post = hexo.model('Post');
let post;

before(async () => {
hexo.config.permalink = ':year/:month/:day/:title/';
hexo.config.permalink_defaults = {};
