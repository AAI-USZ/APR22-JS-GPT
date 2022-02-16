'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const chalk = require('chalk');
const tildify = require('tildify');
const Transform = require('stream').Transform;
const PassThrough = require('stream').PassThrough;
const util = require('hexo-util');

const join = pathFn.join;

function generateConsole(args = {}) {
const force = args.f || args.force;
const bail = args.b || args.bail;
const route = this.route;
const publicDir = this.public_dir;
const log = this.log;
let start = process.hrtime();
const Cache = this.model('Cache');
const generatingFiles = {};

function generateFile(path) {

if (generatingFiles[path]) return Promise.resolve();


generatingFiles[path] = true;

