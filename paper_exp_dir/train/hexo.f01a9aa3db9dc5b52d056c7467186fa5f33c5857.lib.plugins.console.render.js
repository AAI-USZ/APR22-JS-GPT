'use strict';

var pathFn = require('path');
var tildify = require('tildify');
var prettyHrtime = require('pretty-hrtime');
var fs = require('hexo-fs');
var chalk = require('chalk');

function renderConsole(args) {

if (!args._.length) {
return this.call('help', {_: 'render'});
}

var baseDir = this.base_dir;
var src = pathFn.resolve(baseDir, args._[0]);
var output = args.o || args.output;
var start = process.hrtime();
var log = this.log;
