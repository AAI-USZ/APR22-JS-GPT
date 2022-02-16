var pathFn = require('path');
var fs = require('hexo-fs');
var tildify = require('tildify');
var Promise = require('bluebird');
var vm = require('vm');
var Module = require('module');

var pre = '(function(exports, require, module, __filename, __dirname, hexo){';
var post = '});';

require('colors');

