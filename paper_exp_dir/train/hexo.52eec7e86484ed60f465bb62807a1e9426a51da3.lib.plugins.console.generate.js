'use strict';

const fs = require('hexo-fs');
const { join } = require('path');
const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const chalk = require('chalk');
const tildify = require('tildify');
const { Transform } = require('stream');
const { PassThrough } = require('stream');
const util = require('hexo-util');

function generateConsole(args = {}) {
const { force } = args.f || args;
const { bail } = args.b || args;
const { route } = this;
const publicDir = this.public_dir;
const { log } = this;
const self = this;
let start = process.hrtime();
const Cache = this.model('Cache');
