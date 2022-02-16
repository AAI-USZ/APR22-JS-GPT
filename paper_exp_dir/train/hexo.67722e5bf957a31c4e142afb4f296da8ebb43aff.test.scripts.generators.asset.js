var should = require('chai').should();
var Promise = require('bluebird');
var pathFn = require('path');
var fs = require('hexo-fs');
var testUtil = require('../../util');

describe('asset', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'asset_test'), {silent: true});
var generator = require('../../../lib/plugins/generator/asset').bind(hexo);
