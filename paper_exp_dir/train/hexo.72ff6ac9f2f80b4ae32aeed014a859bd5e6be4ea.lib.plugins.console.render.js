var Promise = require('bluebird');
var pathFn = require('path');
var tildify = require('tildify');
var prettyHrtime = require('pretty-hrtime');
var fs = require('hexo-fs');
var chalk = require('chalk');

module.exports = function(args){
var baseDir = this.base_dir;
var render = this.render;
var log = this.log;
var files = args._;
var output = args.o || args.output;
var engine = args.engine;

