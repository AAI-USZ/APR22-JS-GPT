'use strict';

var should = require('chai').should();

describe('markdown', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
render: require('../../../lib/plugins/helper/render')(hexo)
};
