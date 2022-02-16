'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Tag', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Tag = hexo.model('Tag');
var Post = hexo.model('Post');
var PostTag = hexo.model('PostTag');

before(function() {
return hexo.init();
