var extend = require('./extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
render = require('./render'),
util = require('./util'),
file = util.file,
async = require('async'),
fs = require('fs'),
config = hexo.config,
baseDir = hexo.base_dir,
publicDir = hexo.public_dir,
themeDir = hexo.theme_dir,
_ = require('underscore');

