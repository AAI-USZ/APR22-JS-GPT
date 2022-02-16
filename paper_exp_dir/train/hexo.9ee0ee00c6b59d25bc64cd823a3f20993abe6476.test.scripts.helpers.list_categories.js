'use strict';

var should = require('chai').should();
var Promise = require('bluebird');

describe('list_categories', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Category = hexo.model('Category');

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listCategories = require('../../../lib/plugins/helper/list_categories').bind(ctx);

before(function(){
return Post.insert([
{source: 'foo', slug: 'foo'},
