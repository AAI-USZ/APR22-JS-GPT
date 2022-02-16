'use strict';

var should = require('chai').should();

describe('link_to', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
config: hexo.config
};
