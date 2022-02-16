var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');

describe('PostAsset', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var PostAsset = hexo.model('PostAsset');
var Post = hexo.model('Post');
var post;
