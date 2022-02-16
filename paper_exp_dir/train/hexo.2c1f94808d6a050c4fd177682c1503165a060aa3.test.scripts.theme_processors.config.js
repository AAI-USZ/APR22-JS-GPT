'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

describe('config', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
var processor = require('../../../lib/theme/processors/config');
var process = Promise.method(processor.process.bind(hexo));
