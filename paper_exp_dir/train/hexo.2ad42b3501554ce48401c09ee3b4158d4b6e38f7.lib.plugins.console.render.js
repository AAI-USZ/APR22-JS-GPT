var Promise = require('bluebird');
var pathFn = require('path');
var tildify = require('tildify');
var prettyHrtime = require('pretty-hrtime');
var util = require('../../util');
var fs = util.fs;

require('colors');

module.exports = function(ctx){
var render = ctx.render;
var baseDir = hexo.base_dir;
