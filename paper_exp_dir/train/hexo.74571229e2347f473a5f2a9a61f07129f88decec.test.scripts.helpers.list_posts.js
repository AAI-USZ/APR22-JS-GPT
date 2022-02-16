'use strict';

var should = require('chai').should();

describe('list_posts', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');

var ctx = {
site: hexo.locals,
