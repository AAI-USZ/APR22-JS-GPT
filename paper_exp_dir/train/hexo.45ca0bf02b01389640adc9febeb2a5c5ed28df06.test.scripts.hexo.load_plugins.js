var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');

describe('Load plugins', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'plugin_test'), {silent: true});
var loadPlugins = require('../../../lib/hexo/load_plugins');

var script = [
'hexo._script_test = {',
'  filename: __filename,',
