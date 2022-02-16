'use strict';

const fixture = require('../../fixtures/post_render');

describe('Render post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Post = hexo.model('Post');
const Page = hexo.model('Page');
const renderPost = require('../../../lib/plugins/filter/before_generate/render_post').bind(hexo);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));
