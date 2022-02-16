'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var pathFn = require('path');
var fs = require('hexo-fs');

describe.skip('Stop watchers', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'stop_watcher_test'));
