var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var yaml = require('js-yaml');

describe('File', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Box = require('../../../lib/box');
var box = new Box(hexo, __dirname);
var target = pathFn.join(__dirname, '../../fixtures/test.yml');
var body;
