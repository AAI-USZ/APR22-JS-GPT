'use strict';

var should = require('chai').should();
var Promise = require('bluebird');

describe('list_tags', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listTags = require('../../../lib/plugins/helper/list_tags').bind(ctx);

before(function(){
return Post.insert([
{source: 'foo', slug: 'foo'},
