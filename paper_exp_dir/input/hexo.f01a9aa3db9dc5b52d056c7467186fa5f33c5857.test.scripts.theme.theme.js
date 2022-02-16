'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'theme_test'), {silent: true});
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

return Promise.all([
fs.mkdirs(themeDir),
fs.writeFile(hexo.config_path, 'theme: test')
