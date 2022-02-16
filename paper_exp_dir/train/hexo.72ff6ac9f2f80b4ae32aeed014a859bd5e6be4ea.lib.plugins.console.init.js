var pathFn = require('path');
var tildify = require('tildify');
var fs = require('hexo-fs');
var chalk = require('chalk');

module.exports = function(args){
var baseDir = this.base_dir;
var log = this.log;
var assetDir = pathFn.join(this.core_dir, 'assets');
var target = args._[0] ? pathFn.resolve(baseDir, args._[0]) : baseDir;

log.info('Copying data to %s', chalk.magenta(tildify(target)));

