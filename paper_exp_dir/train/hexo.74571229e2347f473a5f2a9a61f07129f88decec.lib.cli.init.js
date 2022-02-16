'use strict';

var Hexo = require('../hexo');
var findPkg = require('./find_pkg');
var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');
var notifier = updateNotifier({pkg: pkg});

var byeWords = [
'Good bye',
