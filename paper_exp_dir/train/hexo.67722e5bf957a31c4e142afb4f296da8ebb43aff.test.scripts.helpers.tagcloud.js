var should = require('chai').should();
var Promise = require('bluebird');

describe('tagcloud', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');

var ctx = {
