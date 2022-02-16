'use strict';

var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var yaml = require('js-yaml');
var _ = require('lodash');
var getHash = require('../../../lib/hash').hash;

describe('File', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Box = require('../../../lib/box');
var box = new Box(hexo, pathFn.join(hexo.base_dir, 'file_test'));
var File = box.File;
var Cache = box.Cache;
