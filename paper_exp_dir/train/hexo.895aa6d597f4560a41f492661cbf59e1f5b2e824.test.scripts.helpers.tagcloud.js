var should = require('chai').should();
var Promise = require('bluebird');

describe('tagcloud', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');

var ctx = {
site: hexo.locals,
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var tagcloud = require('../../../lib/plugins/helper/tagcloud').bind(ctx);

