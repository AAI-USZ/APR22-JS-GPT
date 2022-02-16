var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var sep = pathFn.sep;
var testUtil = require('../../util');

describe('Hexo', () => {
var base_dir = pathFn.join(__dirname, 'hexo_test');
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(base_dir, {silent: true});
var coreDir = pathFn.join(__dirname, '../../..');
var version = require('../../../package.json').version;
var Post = hexo.model('Post');
var Page = hexo.model('Page');
var Data = hexo.model('Data');
var route = hexo.route;

