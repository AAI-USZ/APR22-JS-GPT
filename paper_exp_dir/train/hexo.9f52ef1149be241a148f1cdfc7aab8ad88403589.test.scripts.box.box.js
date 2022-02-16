'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const util = require('hexo-util');
const sinon = require('sinon');
const Pattern = util.Pattern;

describe('Box', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = pathFn.join(__dirname, 'box_tmp');
