'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var fs = require('hexo-fs');
var pathFn = require('path');

describe('data', function(){
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'data_test');
