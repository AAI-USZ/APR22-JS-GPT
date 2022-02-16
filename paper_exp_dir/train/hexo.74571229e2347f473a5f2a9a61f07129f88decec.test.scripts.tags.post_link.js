'use strict';

var should = require('chai').should();

describe('post_link', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var postLink = require('../../../lib/plugins/tag/post_link')(hexo);
var Post = hexo.model('Post');

hexo.config.permalink = ':title/';

