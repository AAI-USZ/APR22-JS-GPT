'use strict';

const { join, sep } = require('path');
const { appendFile, mkdir, mkdirs, rename, rmdir, stat, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const { hash, Pattern } = require('hexo-util');
const { spy } = require('sinon');

describe('Box', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = join(__dirname, 'box_tmp');
const Box = require('../../../lib/box');

