'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Category', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Category = hexo.model('Category');
var Post = hexo.model('Post');
var PostCategory = hexo.model('PostCategory');

