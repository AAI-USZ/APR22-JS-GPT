var _ = require('underscore'),
async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
sep = pathFn.sep,
process = require('./process'),
model = require('./model'),
route = require('./route'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
i18n = require('./i18n').i18n,
render = require('./render'),
compile = render.compile,
extend = require('./extend'),
renderer = extend.renderer.list(),
helper = extend.helper.list(),
generator = extend.generator.list(),
config = hexo.config,
sourceDir = hexo.source_dir,
themeDir = hexo.theme_dir,
layoutDir = themeDir + 'layout' + sep,
layoutCache = {};
