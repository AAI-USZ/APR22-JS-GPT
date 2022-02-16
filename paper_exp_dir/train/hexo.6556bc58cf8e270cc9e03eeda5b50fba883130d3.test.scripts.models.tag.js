'use strict';

const { deepMerge, full_url_for } = require('hexo-util');

describe('Tag', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Tag = hexo.model('Tag');
const Post = hexo.model('Post');
const PostTag = hexo.model('PostTag');
const defaults = require('../../../lib/hexo/default_config');

