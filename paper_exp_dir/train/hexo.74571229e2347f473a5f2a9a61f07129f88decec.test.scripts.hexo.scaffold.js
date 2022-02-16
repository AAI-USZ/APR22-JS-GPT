'use strict';

var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');

describe('Scaffold', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
