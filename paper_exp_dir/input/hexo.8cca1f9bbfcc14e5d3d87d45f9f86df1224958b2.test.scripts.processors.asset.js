'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

var dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('asset', function() {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'asset_test');
var hexo = new Hexo(baseDir);
var process = asset.process.bind(hexo);
