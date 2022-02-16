'use strict';

const { exists, writeFile, unlink, stat, mkdirs } = require('hexo-fs');
const { join } = require('path');
const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const { cyan, magenta } = require('chalk');
const tildify = require('tildify');
const { PassThrough } = require('stream');
const { createSha1Hash } = require('hexo-util');

class Generater {
constructor(ctx, args) {
this.context = ctx;
this.force = args.f || args.force;
this.bail = args.b || args.bail;
this.concurrency = args.c || args.concurrency;
this.watch = args.w || args.watch;
this.deploy = args.d || args.deploy;
