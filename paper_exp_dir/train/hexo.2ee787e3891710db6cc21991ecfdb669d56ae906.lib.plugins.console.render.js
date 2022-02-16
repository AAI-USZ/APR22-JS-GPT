'use strict';

const pathFn = require('path');
const tildify = require('tildify');
const prettyHrtime = require('pretty-hrtime');
const fs = require('hexo-fs');
const chalk = require('chalk');

function renderConsole(args) {

if (!args._.length) {
return this.call('help', {_: 'render'});
}

const baseDir = this.base_dir;
const src = pathFn.resolve(baseDir, args._[0]);
const output = args.o || args.output;
const start = process.hrtime();
const log = this.log;
