'use strict';

var should = require('chai').should();
var Promise = require('bluebird');

describe('list_categories', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Category = hexo.model('Category');
