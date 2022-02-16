'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

describe('partial', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'partial_test'), {silent: true});
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');
var viewDir = pathFn.join(themeDir, 'layout') + pathFn.sep;
