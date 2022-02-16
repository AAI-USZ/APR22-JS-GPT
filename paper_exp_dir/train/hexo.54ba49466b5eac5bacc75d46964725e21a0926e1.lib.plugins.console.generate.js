'use strict';

const fs = require('hexo-fs');
const { join } = require('path');
const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const chalk = require('chalk');
const tildify = require('tildify');
const { Transform, PassThrough } = require('stream');
const { HashStream } = require('hexo-util');

function generateConsole(args = {}) {
const force = args.f || args.force;
const bail = args.b || args.bail;
const { route, log } = this;
const publicDir = this.public_dir;
const self = this;
let start = process.hrtime();
