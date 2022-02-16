'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');
var Promise = require('bluebird');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');
var Category = hexo.model('Category');
