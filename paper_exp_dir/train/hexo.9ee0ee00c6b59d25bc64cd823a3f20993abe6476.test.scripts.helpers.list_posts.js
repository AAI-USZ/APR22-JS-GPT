'use strict';

var should = require('chai').should();

describe('list_posts', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listPosts = require('../../../lib/plugins/helper/list_posts').bind(ctx);

hexo.config.permalink = ':title/';

before(function(){
