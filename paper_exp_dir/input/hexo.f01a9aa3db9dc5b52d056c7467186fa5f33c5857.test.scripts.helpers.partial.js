'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'partial_test'), {silent: true});
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');
var viewDir = pathFn.join(themeDir, 'layout') + pathFn.sep;

var ctx = {
site: hexo.locals,
config: hexo.config,
view_dir: viewDir,
filename: pathFn.join(viewDir, 'post', 'article.swig'),
foo: 'foo',
cache: true
};

ctx.fragment_cache = require('../../../lib/plugins/helper/fragment_cache')(hexo);

hexo.env.init = true;

var partial = require('../../../lib/plugins/helper/partial')(hexo).bind(ctx);

return Promise.all([
fs.mkdirs(themeDir),
fs.writeFile(hexo.config_path, 'theme: test')
