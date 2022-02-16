'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var Promise = require('bluebird');
var _ = require('lodash');

describe('Tag', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Tag = hexo.model('Tag');
var Post = hexo.model('Post');
var PostTag = hexo.model('PostTag');
