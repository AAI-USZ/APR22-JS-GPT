var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var util = require('hexo-util');
var sinon = require('sinon');
var Pattern = util.Pattern;

describe('Box', () => {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'box_tmp');
var Box = require('../../../lib/box');

function newBox(path, config) {
var hexo = new Hexo(baseDir, {silent: true});
hexo.config = Object.assign(hexo.config, config);
var base = path ? pathFn.join(baseDir, path) : baseDir;
return new Box(hexo, base);
}

before(() => fs.mkdir(baseDir));

after(() => fs.rmdir(baseDir));

