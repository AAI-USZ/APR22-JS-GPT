var fs = require('graceful-fs'),
pathFn = require('path'),
sep = pathFn.sep,
swig = require('swig'),
moment = require('moment'),
_ = require('underscore'),
Schema = hexo.db.Schema,
extend = require('../../extend'),
renderer = Object.keys(extend.renderer.list()),
tagExt = extend.tag.list(),
render = require('../../render'),
route = require('../../route'),