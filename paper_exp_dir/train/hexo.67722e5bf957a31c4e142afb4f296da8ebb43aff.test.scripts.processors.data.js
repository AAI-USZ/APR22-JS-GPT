var should = require('chai').should();
var Promise = require('bluebird');
var fs = require('hexo-fs');
var pathFn = require('path');

describe('data', () => {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'data_test');
var hexo = new Hexo(baseDir);
var processor = require('../../../lib/plugins/processor/data')(hexo);
