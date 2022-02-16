'use strict';

const moment = require('moment');

const PERMALINK = ':year/:month/:day/:title/';

describe('post_permalink', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const postPermalink = require('../../../lib/plugins/filter/post_permalink').bind(hexo);
const Post = hexo.model('Post');
let post;
