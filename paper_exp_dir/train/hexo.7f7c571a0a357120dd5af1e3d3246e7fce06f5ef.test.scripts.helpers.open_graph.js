'use strict';

const moment = require('moment');
const cheerio = require('cheerio');
const { encodeURL } = require('hexo-util');
const defaultConfig = require('../../../lib/hexo/default_config');

describe('open_graph', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const openGraph = require('../../../lib/plugins/helper/open_graph');
const isPost = require('../../../lib/plugins/helper/is').post;
const tag = require('hexo-util').htmlTag;
const Post = hexo.model('Post');

