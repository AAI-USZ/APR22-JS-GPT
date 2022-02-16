var should = require('chai').should();
var fixture = require('../../fixtures/post_render');

describe('Render post', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Post = hexo.model('Post');
var Page = hexo.model('Page');
var renderPost = require('../../../lib/plugins/filter/before_generate/render_post').bind(hexo);

