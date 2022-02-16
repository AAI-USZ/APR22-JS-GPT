'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var xxhash = require('xxhash');
var util = require('hexo-util');
var sinon = require('sinon');
var Pattern = util.Pattern;

function getHash(content) {
return xxhash.hash(new Buffer(content), 0xCAFEBABE);
}

describe('Box', function() {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'box_tmp');
var Box = require('../../../lib/box');

