'use strict';

var should = require('chai').should();

describe('feed_tag', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
config: hexo.config
};
