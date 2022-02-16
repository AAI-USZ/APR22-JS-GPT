'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var _ = require('lodash');

describe('Load config', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
