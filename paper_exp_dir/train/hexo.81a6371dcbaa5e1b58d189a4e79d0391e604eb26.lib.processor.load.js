
var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
util = require('../util'),
file = util.file,
yfm = util.yfm,
highlight = util.highlight,
pathFn = require('path'),
sep = pathFn.sep,