'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var util = require('hexo-util');
var sinon = require('sinon');
var Pattern = util.Pattern;

describe('Box', function() {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'box_tmp');
var Box = require('../../../lib/box');

function newBox(path) {
var hexo = new Hexo(baseDir, {silent: true});
var base = path ? pathFn.join(baseDir, path) : baseDir;
return new Box(hexo, base);
}
