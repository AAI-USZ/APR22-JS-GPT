var should = require('chai').should();
var pathFn = require('path');
var Hexo = require('../../../lib/hexo');
var Box = require('../../../lib/box');
var util = Hexo.util;
var fs = util.fs;

describe('Box', function(){
var hexo = new Hexo(__dirname, {});
var base = pathFn.join(__dirname, 'tmp');
var box = new Box(hexo, base);

before(function(){
